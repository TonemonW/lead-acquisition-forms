import { useFormContext } from 'react-hook-form';
import { loanTypeEnum, type LoanFormData } from '../types/loanForm';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select } from './ui/select';
import { IconChevronDown, IconCurrency, IconError } from './ui/icon';

const LOAN_TYPES = loanTypeEnum.options;

interface LoanDetailsStepProps {
    onNext: () => void;
}

export const LoanDetailsStep = ({ onNext }: LoanDetailsStepProps) => {
    const {
        register,
        formState: { errors },
        setValue,
        trigger,
        watch,
    } = useFormContext<LoanFormData>();

    const onSubmit = async () => {
        const isStepValid = await trigger(['loanAmount', 'loanType']);
        if (isStepValid) onNext();
    };

    const handleAmountInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D+/g, '').replace(/^0+(?!$)/, '');
        if (raw !== watch('loanAmount')) {
            setValue('loanAmount', raw, { shouldValidate: true, shouldDirty: true });
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-4" aria-hidden>
                    <IconCurrency className="w-6 h-6 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Loan Details</h2>
                <p className="text-gray-600">Tell us about your loan requirements and we'll provide you with the best options available.</p>
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    void onSubmit();
                }}
                className="space-y-6"
                noValidate
            >
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                    <Label htmlFor="loanAmount">Loan Amount *</Label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 text-sm">$</span>
                        </div>
                        <Input
                            {...register('loanAmount')}
                            id="loanAmount"
                            inputMode="numeric"
                            autoComplete="off"
                            onChange={handleAmountInput}
                            onWheel={(e) => (e.currentTarget as HTMLInputElement).blur()}
                            className="pl-8 pr-4"
                            placeholder="Enter amount"
                            aria-invalid={!!errors.loanAmount}
                            aria-describedby="loanAmount-error"
                            invalid={!!errors.loanAmount}
                        />
                    </div>
                    <div className="min-h-[24px] mt-2 flex items-center">
                        {errors.loanAmount ? (
                            <p id="loanAmount-error" className="text-sm text-red-600 flex items-center">
                                <IconError className="w-4 h-4 mr-1" />
                                {errors.loanAmount.message as string}
                            </p>
                        ) : (
                            <div className="text-sm">&nbsp;</div>
                        )}
                    </div>
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                    <Label htmlFor="loanType">Loan Type *</Label>
                    <div className="relative">
                        <Select
                            {...register('loanType')}
                            id="loanType"
                            aria-invalid={!!errors.loanType}
                            aria-describedby="loanType-error"
                            invalid={!!errors.loanType}
                        >
                            <option value="">Please select your loan type</option>
                            {LOAN_TYPES.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </Select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none" aria-hidden>
                            <IconChevronDown className="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                    <div className="min-h-[24px] mt-2 flex items-center">
                        {errors.loanType ? (
                            <p id="loanType-error" className="text-sm text-red-600 flex items-center">
                                <IconError className="w-4 h-4 mr-1" />
                                {errors.loanType.message as string}
                            </p>
                        ) : (
                            <div className="text-sm">&nbsp;</div>
                        )}
                    </div>
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                    <Button type="submit" className="w-full">
                        Continue to Contact Information
                    </Button>
                </div>

                <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
                    <div className="flex items-center justify-center space-x-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" aria-label="Step 1 active" />
                        <div className="w-3 h-3 bg-gray-300 rounded-full" aria-hidden />
                    </div>
                </div>
            </form>
        </div>
    );
}; 