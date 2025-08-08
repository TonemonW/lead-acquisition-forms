import * as React from 'react';
import { cn } from '../../lib/cn';

export type NativeSelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'invalid'> & {
    invalid?: boolean;
};

export const Select = React.forwardRef<HTMLSelectElement, NativeSelectProps>(
    ({ className, children, invalid, ...props }, ref) => {
        const base = 'w-full h-12 rounded-xl px-4 pr-10 border-2 text-base leading-none transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none bg-white';
        const state = invalid ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-orange-300';
        return (
            <select ref={ref} className={cn(base, state, className)} {...props}>
                {children}
            </select>
        );
    }
);
Select.displayName = 'Select';