import * as React from 'react';
import { cn } from '../../lib/cn';

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'invalid'> & {
    invalid?: boolean;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, invalid, ...props }, ref) => {
        const base = 'w-full rounded-xl py-3 border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500';
        const state = invalid ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-orange-300';
        return <input ref={ref} className={cn(base, state, className)} {...props} />;
    }
);
Input.displayName = 'Input';