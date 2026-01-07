import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface FilterInputProps {
    filter: string;
    onFilterChange: (value: string) => void;
}

const FilterInput = ({ filter, onFilterChange }: FilterInputProps) => {
    return (
        <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
                type="text"
                placeholder="Search coins..."
                value={filter}
                onChange={(e) => onFilterChange(e.target.value)}
                className="pl-9"
            />
        </div>
    );
};

export default FilterInput;
