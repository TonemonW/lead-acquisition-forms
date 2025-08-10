import { useFormContext, type FieldErrors, type Path } from 'react-hook-form';

export function useFocusFirstInvalid<TFieldValues extends Record<string, unknown>>() {
    const { setFocus } = useFormContext<TFieldValues>();

    return (errors: FieldErrors<TFieldValues>, order: Array<Path<TFieldValues>>) => {
        for (const field of order) {
            const hasError = Boolean((errors as unknown as Record<string, unknown>)[field as unknown as string]);
            if (hasError) {
                setFocus(field);
                break;
            }
        }
    };
}


