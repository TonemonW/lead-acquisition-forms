import * as React from 'react';
import { cn } from '../../lib/cn';

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
    ({ className, ...props }, ref) => {
        return <label ref={ref} className={cn('block text-sm font-semibold text-gray-700 mb-2', className)} {...props} />;
    }
);
Label.displayName = 'Label';