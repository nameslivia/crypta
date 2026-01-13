import type { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    description: string;
    footerText: string;
    footerLinkText: string;
    footerLinkTo: string;
}

export const AuthLayout = ({
    children,
    title,
    description,
    footerText,
    footerLinkText,
    footerLinkTo,
}: AuthLayoutProps) => {
    return (
        <div className="flex items-center justify-center min-h-[80vh] px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">{title}</CardTitle>
                    <CardDescription className="text-center">
                        {description}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {children}
                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        {footerText}{' '}
                        <Link to={footerLinkTo} className="text-primary hover:underline font-medium">
                            {footerLinkText}
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
