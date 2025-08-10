import * as React from 'react';
import { cn } from '../../lib/cn';

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'invalid'> & {
    invalid?: boolean;
};

const INPUT_BASE_CLASS =
    'w-full rounded-xl py-3 border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500';

const getInputStateClass = (invalid?: boolean) =>
    invalid ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-orange-300';

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, invalid, ...props }, ref) => {
    return <input ref={ref} className={cn(INPUT_BASE_CLASS, getInputStateClass(invalid), className)} {...props} />;
});
Input.displayName = 'Input';