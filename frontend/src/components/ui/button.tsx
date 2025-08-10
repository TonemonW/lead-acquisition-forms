import * as React from 'react';
import { cn } from '../../lib/cn';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'outline';
};

const BUTTON_BASE_CLASS =
    'inline-flex items-center justify-center rounded-xl font-semibold py-3 px-6 transition-colors duration-200 focus:outline-none';
const BUTTON_VARIANTS_CLASS: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700',
    secondary: 'border-2 border-gray-300 text-gray-700 hover:border-orange-300 hover:text-orange-600',
    outline: 'border-2 border-gray-200 text-gray-800 hover:border-orange-300',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, type = 'button', variant = 'primary', ...props }, ref) => {
        return (
            <button
                ref={ref}
                type={type}
                className={cn(
                    BUTTON_BASE_CLASS,
                    BUTTON_VARIANTS_CLASS[variant],
                    'disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]',
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';