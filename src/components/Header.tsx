import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User as UserIcon } from 'lucide-react';

const Header = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="border-b bg-card">
            <div className="container mx-auto px-4">
                <nav className="flex items-center justify-between h-16">
                    <Link
                        to="/"
                        className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
                    >
                        🚀 Crypta
                    </Link>

                    <div className="flex items-center gap-6">
                        <ul className="flex items-center gap-6">
                            <li>
                                <Link
                                    to="/"
                                    className={cn(
                                        "text-sm font-medium transition-colors hover:text-primary",
                                        "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/trends"
                                    className={cn(
                                        "text-sm font-medium transition-colors hover:text-primary",
                                        "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    Trends
                                </Link>
                            </li>
                            {isAuthenticated && (
                                <li>
                                    <Link
                                        to="/portfolio"
                                        className={cn(
                                            "text-sm font-medium transition-colors hover:text-primary",
                                            "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        Portfolio
                                    </Link>
                                </li>
                            )}
                            <li>
                                <Link
                                    to="/coins-table"
                                    className={cn(
                                        "text-sm font-medium transition-colors hover:text-primary",
                                        "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    Coins Table
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/about"
                                    className={cn(
                                        "text-sm font-medium transition-colors hover:text-primary",
                                        "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    About
                                </Link>
                            </li>
                        </ul>

                        {isAuthenticated ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user?.avatar} alt={user?.name} />
                                            <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user?.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {user?.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" asChild>
                                    <Link to="/login">Log in</Link>
                                </Button>
                                <Button asChild>
                                    <Link to="/register">Sign up</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
