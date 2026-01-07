import { cn } from '@/lib/utils';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    color?: string;
    className?: string;
}

const Spinner = ({ size = 'md', className }: SpinnerProps) => {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4',
    };

    return (
        <div className={cn('flex justify-center items-center py-8', className)}>
            <div
                className={cn(
                    'animate-spin rounded-full border-t-transparent border-primary',
                    sizeClasses[size]
                )}
            />
        </div>
    );
};

export default Spinner;
