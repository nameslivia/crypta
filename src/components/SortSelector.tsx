import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface SortSelectorProps {
    sortBy: string;
    onSortChange: (value: string) => void;
}

const SortSelector = ({ sortBy, onSortChange }: SortSelectorProps) => {
    return (
        <div className="flex items-center gap-2">
            <label className="text-sm font-medium whitespace-nowrap">
                Sort by:
            </label>
            <Select value={sortBy} onValueChange={onSortChange}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="market_cap_desc">Market Cap (High to Low)</SelectItem>
                    <SelectItem value="market_cap_asc">Market Cap (Low to High)</SelectItem>
                    <SelectItem value="price_desc">Price (High to Low)</SelectItem>
                    <SelectItem value="price_asc">Price (Low to High)</SelectItem>
                    <SelectItem value="change_desc">Change % (High to Low)</SelectItem>
                    <SelectItem value="change_asc">Change % (Low to High)</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
};

export default SortSelector;
