import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loanFormSchema, type LoanFormData } from '@lead/shared/types/loanForm';
import { LoanDetailsStep } from './components/LoanDetailsStep';
import { ContactInformationStep } from './components/ContactInformationStep';
import { useLoanFormSteps } from './hooks/useLoanFormSteps';

function App() {
  const methods = useForm<LoanFormData>({
    defaultValues: { loanAmount: '', loanType: undefined, fullName: '', email: '', phoneNumber: '' },
    mode: 'onChange',
    resolver: zodResolver(loanFormSchema),
  });
  const { step, isSubmitted, getAnimationClasses, handleNext, handleBack, handleSubmit } = useLoanFormSteps(methods);

  return (
    <div className="min-h-[590px] form-step-container w-full max-w-md mx-auto p-6 border rounded-xl shadow bg-white overflow-hidden">
      <div role="status" aria-atomic="true" className="sr-only">
        {step === 'loan' ? 'Loan Details' : 'Contact Information'}
      </div>
      <div className={`transition-all duration-300 ease-out ${getAnimationClasses()}`}>
        <FormProvider {...methods}>
          {step === 'loan' && <LoanDetailsStep onNext={handleNext} />}
          {step === 'contact' && (
            <ContactInformationStep onBack={handleBack} onSubmit={handleSubmit} isSubmitted={isSubmitted} />
          )}
        </FormProvider>
      </div>
    </div>
  );
}

export default App;