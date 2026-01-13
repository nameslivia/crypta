import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, AlertTriangle } from 'lucide-react';

const NotFoundPage = () => {
    return (
        <div className="container mx-auto px-4 h-[80vh] flex items-center justify-center">
            <Card className="max-w-md w-full text-center p-8 border-2 border-dashed">
                <CardHeader>
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-destructive/10 rounded-full">
                            <AlertTriangle className="w-12 h-12 text-destructive" />
                        </div>
                    </div>
                    <CardTitle className="text-6xl font-black mb-2 font-mono">404</CardTitle>
                    <p className="text-muted-foreground text-lg uppercase tracking-widest font-semibold">
                        Page Not Found
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-muted-foreground">
                        Oops! The page you are looking for doesn't exist or has been moved to another galaxy.
                    </p>
                    <Link to="/" className="block">
                        <Button size="lg" className="w-full gap-2">
                            <Home className="w-4 h-4" /> Back to Home
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
};

export default NotFoundPage;
