import { useState, useEffect, type ReactNode } from 'react';
import { AuthContext, type User } from '@/context/auth-context';

/* 
  Mock Auth Implementation
  In a real app, this would talk to Firebase/Supabase/NextAuth
*/

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Stimulate checking session on component mount
        const initAuth = async () => {
            try {
                const storedUser = localStorage.getItem('crypta_user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error("Failed to parse user session", error);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (name: string, email: string) => {
        setIsLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const newUser: User = {
            id: Date.now().toString(),
            name,
            email,
            // Generate a deterministic color avatar or use placeholder
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        };

        setUser(newUser);
        localStorage.setItem('crypta_user', JSON.stringify(newUser));
        setIsLoading(false);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('crypta_user');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                login,
                logout,
                isLoading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
