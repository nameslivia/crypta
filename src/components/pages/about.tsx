import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LayoutDashboard, ShieldCheck, Zap, BarChart } from 'lucide-react';

const AboutPage = () => {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold tracking-tight mb-4">About Crypta</h1>
                <p className="text-muted-foreground text-lg">
                    Helping you stay ahead in the fast-paced world of digital assets.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <AboutFeature
                    icon={<Zap className="w-6 h-6 text-yellow-500" />}
                    title="Real-Time Data"
                    description="Powered by professional-grade APIs to give you the most accurate price and volume information available."
                />
                <AboutFeature
                    icon={<LayoutDashboard className="w-6 h-6 text-blue-500" />}
                    title="Portfolio Tracking"
                    description="Easily record your transactions and watch your profit and loss evolve as the market moves."
                />
                <AboutFeature
                    icon={<BarChart className="w-6 h-6 text-purple-500" />}
                    title="Market Trends"
                    description="Identify the biggest movers and monitor dominance to understand where the smart money is going."
                />
                <AboutFeature
                    icon={<ShieldCheck className="w-6 h-6 text-green-500" />}
                    title="Privacy Focused"
                    description="Your portfolio data is stored locally on your device. We don't track your holdings on our servers."
                />
            </div>

            <Card className="bg-muted/30">
                <CardHeader>
                    <CardTitle>Project Mission</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p>
                        Crypta was built with a single goal: to provide a clean, fast, and powerful interface for cryptocurrency enthusiasts.
                        Whether you're a casual observer or a serious investor, we provide the tools you need to analyze the market.
                    </p>
                    <p>
                        This application is built using modern web technologies including <strong>React 19</strong>, <strong>TypeScript</strong>,
                        <strong>Tailwind CSS v4</strong>, and <strong>shadcn/ui</strong>.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-4">
                        <Badge variant="secondary">React</Badge>
                        <Badge variant="secondary">TypeScript</Badge>
                        <Badge variant="secondary">Tailwind CSS</Badge>
                        <Badge variant="secondary">shadcn/ui</Badge>
                        <Badge variant="secondary">Lucide Icons</Badge>
                        <Badge variant="secondary">Radix UI</Badge>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

const AboutFeature = ({ icon, title, description }: any) => (
    <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <div className="p-3 bg-card rounded-xl shadow-sm border">
                {icon}
            </div>
            <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground text-sm leading-relaxed">
                {description}
            </p>
        </CardContent>
    </Card>
);

export default AboutPage;
