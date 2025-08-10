import type React from 'react';
import { useFormContext } from 'react-hook-form';
import type { LoanFormData } from '@lead/shared/types/loanForm';
import { useFocusFirstInvalid } from './useFocusFirstInvalid';

export function useLoanDetailsForm(onNext: () => void) {
    const {
        formState: { errors },
        setValue,
        trigger,
        watch,
    } = useFormContext<LoanFormData>();

    const focusFirstInvalid = useFocusFirstInvalid<LoanFormData>();

    const handleSubmit = async () => {
        const isStepValid = await trigger(['loanAmount', 'loanType']);
        if (isStepValid) {
            onNext();
        } else {
            focusFirstInvalid(errors, ['loanAmount', 'loanType']);
        }
    };

    const handleAmountInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D+/g, '').replace(/^0+(?!$)/, '');
        if (raw !== watch('loanAmount')) {
            setValue('loanAmount', raw, { shouldValidate: true, shouldDirty: true });
        }
    };

    return {
        errors,
        handleSubmit,
        handleAmountInput,
    };
}


