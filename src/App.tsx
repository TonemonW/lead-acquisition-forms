import { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loanFormSchema, type LoanFormData } from './types/loanForm';
import { LoanDetailsStep } from './components/LoanDetailsStep';
import { ContactInformationStep } from './components/ContactInformationStep';

function App() {
  const [step, setStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextStep, setNextStep] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // timers for transition control
  const slideOutTimerRef = useRef<number>(null);
  const settleTimerRef = useRef<number>(null);
  // timer for submit reset
  const submitResetTimerRef = useRef<number>(null);

  useEffect(() => {
    return () => {
      if (slideOutTimerRef.current) {
        clearTimeout(slideOutTimerRef.current);
        slideOutTimerRef.current = null;
      }
      if (settleTimerRef.current) {
        clearTimeout(settleTimerRef.current);
        settleTimerRef.current = null;
      }
      if (submitResetTimerRef.current) {
        clearTimeout(submitResetTimerRef.current);
        submitResetTimerRef.current = null;
      }
    };
  }, []);

  const methods = useForm<LoanFormData>({
    defaultValues: { loanAmount: '', loanType: undefined, fullName: '', email: '', phoneNumber: '' },
    mode: 'onChange',
    resolver: zodResolver(loanFormSchema),
  });

  const animateToStep = (targetStep: number) => {
    if (isTransitioning) return;

    // clear any previous timers just in case
    if (slideOutTimerRef.current) {
      clearTimeout(slideOutTimerRef.current);
      slideOutTimerRef.current = null;
    }
    if (settleTimerRef.current) {
      clearTimeout(settleTimerRef.current);
      settleTimerRef.current = null;
    }

    setIsTransitioning(true);
    setNextStep(targetStep);
    slideOutTimerRef.current = window.setTimeout(() => {
      setStep(targetStep);
      setNextStep(null);
      settleTimerRef.current = window.setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 200);
  };

  const handleNext = () => animateToStep(2);
  const handleBack = () => animateToStep(1);

  const handleSubmit = (_data: LoanFormData) => {
    setIsSubmitted(true);

    // clear previous submit reset timer if any
    if (submitResetTimerRef.current) {
      clearTimeout(submitResetTimerRef.current);
      submitResetTimerRef.current = null;
    }

    submitResetTimerRef.current = window.setTimeout(() => {
      methods.reset({ loanAmount: '', loanType: undefined, fullName: '', email: '', phoneNumber: '' });
      methods.clearErrors();
      setStep(1);
      setIsSubmitted(false);
      submitResetTimerRef.current = null;
    }, 4000);
  };

  const getAnimationClasses = () => {
    if (isTransitioning) {
      if (nextStep !== null) {
        const direction = nextStep > step ? 'left' : 'right';
        return direction === 'left' ? 'transform -translate-x-8 opacity-0 scale-95' : 'transform translate-x-8 opacity-0 scale-95';
      }
      return 'transform translate-x-0 opacity-100 scale-100';
    }
    return 'transform translate-x-0 opacity-100 scale-100';
  };

  return (
    <div className="min-h-[590px] form-step-container w-full max-w-md mx-auto p-6 border rounded-xl shadow bg-white overflow-hidden">
      <div className={`transition-all duration-300 ease-out ${getAnimationClasses()}`}>
        <FormProvider {...methods}>
          {step === 1 && <LoanDetailsStep onNext={handleNext} />}
          {step === 2 && <ContactInformationStep onBack={handleBack} onSubmit={handleSubmit} isSubmitted={isSubmitted} />}
        </FormProvider>
      </div>
    </div>
  );
}

export default App;
