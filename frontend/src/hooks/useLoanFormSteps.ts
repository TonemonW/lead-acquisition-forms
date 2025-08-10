import { useRef, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { LoanFormData } from '@lead/shared/types/loanForm';

const TRANSITION_SLIDE_OUT_MS = 200;
const TRANSITION_SETTLE_MS = 50;
const SUBMIT_RESET_DELAY_MS = 4000;

export function useLoanFormSteps(methods: UseFormReturn<LoanFormData>) {
    const [step, setStep] = useState<'loan' | 'contact'>('loan');
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const slideOutTimerRef = useRef<number>(null);
    const settleTimerRef = useRef<number>(null);
    const submitResetTimerRef = useRef<number>(null);

    const animateToStep = (targetStep: 'loan' | 'contact') => {
        if (isTransitioning) return;
        if (slideOutTimerRef.current) clearTimeout(slideOutTimerRef.current);
        if (settleTimerRef.current) clearTimeout(settleTimerRef.current);

        setIsTransitioning(true);
        slideOutTimerRef.current = window.setTimeout(() => {
            setStep(targetStep);
            settleTimerRef.current = window.setTimeout(() => {
                setIsTransitioning(false);
            }, TRANSITION_SETTLE_MS);
        }, TRANSITION_SLIDE_OUT_MS);
    };

    const handleNext = () => animateToStep('contact');
    const handleBack = () => animateToStep('loan');

    const handleSubmit = () => {
        setIsSubmitted(true);
        if (submitResetTimerRef.current) clearTimeout(submitResetTimerRef.current);

        submitResetTimerRef.current = window.setTimeout(() => {
            methods.reset({ loanAmount: '', loanType: undefined, fullName: '', email: '', phoneNumber: '' });
            methods.clearErrors();
            setStep('loan');
            setIsSubmitted(false);
        }, SUBMIT_RESET_DELAY_MS);
    };

    const getAnimationClasses = () => {
        if (!isTransitioning) {
            return 'transform translate-x-0 opacity-100 scale-100';
        }
        // When transitioning, use current step to decide direction
        return step === 'contact'
            ? 'transform translate-x-8 opacity-0 scale-95' // contact -> slide to right
            : 'transform -translate-x-8 opacity-0 scale-95'; // loan -> slide to left
    };

    return {
        step,
        isSubmitted,
        getAnimationClasses,
        handleNext,
        handleBack,
        handleSubmit,
    };
}
