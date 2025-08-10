import { useState } from 'react';
import type React from 'react';
import { useFormContext, type FieldErrors } from 'react-hook-form';
import type { LoanFormData } from '../types/loanForm';
import { submitLead as submitLeadApi } from '../services/api';

const PHONE_NUMBER_MAX_LENGTH = 9;

export function useContactForm(onSubmit: (data: LoanFormData) => void, isSubmitted: boolean) {
    const { handleSubmit, setFocus, setValue, watch } = useFormContext<LoanFormData>();

    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFormSubmit = async (data: LoanFormData) => {
        setSubmitError(null);
        setIsSubmitting(true);
        try {
            const payload = {
                fullName: data.fullName,
                email: data.email,
                phoneNumber: `+61${data.phoneNumber}`,
                loanType: data.loanType,
                loanAmount: data.loanAmount,
            };
            await submitLeadApi(payload);
            onSubmit(data);
        } catch (e: unknown) {
            if (e && typeof e === 'object' && 'message' in e) {
                const msg = (e as { message?: unknown }).message;
                setSubmitError(typeof msg === 'string' ? msg : 'Submit failed');
            } else {
                setSubmitError('Submit failed');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInvalid = (formErrors: FieldErrors<LoanFormData>) => {
        const order: Array<keyof LoanFormData> = ['fullName', 'email', 'phoneNumber'];
        for (const field of order) {
            if (formErrors[field]) {
                setFocus(field);
                break;
            }
        }
    };

    const normalizeAndSetPhone = (input: string) => {
        const rawDigits = input.replace(/\D+/g, '');
        let normalized = rawDigits;
        if (normalized.startsWith('61')) {
            normalized = normalized.slice(2);
        } else if (normalized.startsWith('0')) {
            normalized = normalized.slice(1);
        }
        normalized = normalized.slice(0, PHONE_NUMBER_MAX_LENGTH);
        if (normalized !== watch('phoneNumber')) {
            setValue('phoneNumber', normalized, { shouldValidate: true, shouldDirty: true });
        }
    };

    const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        normalizeAndSetPhone(e.target.value);
    };

    const handlePhonePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('Text') ?? '';
        normalizeAndSetPhone(pasted);
    };

    const disabled = isSubmitting;

    return {
        handleSubmit,
        handleFormSubmit,
        handleInvalid,
        handlePhoneInput,
        handlePhonePaste,
        submitError,
        isSubmitting,
        disabled,
    };
}


