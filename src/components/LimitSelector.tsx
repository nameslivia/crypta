import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface LimitSelectorProps {
    limit: number;
    onLimitChange: (value: number) => void;
}

const LimitSelector = ({ limit, onLimitChange }: LimitSelectorProps) => {
    return (
        <div className="flex items-center gap-2">
            <label className="text-sm font-medium whitespace-nowrap">
                Show:
            </label>
            <Select
                value={limit.toString()}
                onValueChange={(value) => onLimitChange(Number(value))}
            >
                <SelectTrigger className="w-[100px]">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
};

export default LimitSelector;
