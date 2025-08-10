import * as React from 'react';
import { cn } from '../../lib/cn';

export type NativeSelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'invalid'> & {
    invalid?: boolean;
};

const SELECT_BASE_CLASS =
    'w-full rounded-xl py-3 px-4 pr-10 border-2 text-base leading-normal transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none bg-white';

const getSelectStateClass = (invalid?: boolean) =>
    invalid ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-orange-300';

export const Select = React.forwardRef<HTMLSelectElement, NativeSelectProps>(
    ({ className, children, invalid, ...props }, ref) => {
        return (
            <select
                ref={ref}
                className={cn(SELECT_BASE_CLASS, getSelectStateClass(invalid), className)}
                {...props}
            >
                {children}
            </select>
        );
    }
);
Select.displayName = 'Select';