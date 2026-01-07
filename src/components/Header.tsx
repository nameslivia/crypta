import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Header = () => {
    return (
        <header className="border-b bg-card">
            <div className="container mx-auto px-4">
                <nav className="flex items-center justify-between h-16">
                    <Link
                        to="/"
                        className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
                    >
                        🚀 Crypto Dash
                    </Link>

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
                </nav>
            </div>
        </header>
    );
};

export default Header;
