import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CoinChartProps {
    coinId: string;
    data?: any[];
}

const CoinChart = ({ coinId }: CoinChartProps) => {
    return (
        <Card className="w-full h-[400px]">
            <CardHeader>
                <CardTitle className="text-lg">Price Chart (24h)</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center bg-muted/30 rounded-md mx-6 mb-6">
                <div className="text-muted-foreground text-center">
                    <p>Chart for {coinId} will be implemented here.</p>
                    <p className="text-xs mt-2">(Integration with Recharts or similar library)</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default CoinChart;
