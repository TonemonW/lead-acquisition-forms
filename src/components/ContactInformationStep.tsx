import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import type { LoanFormData } from '../types/loanForm';
import { submitLead as submitLeadApi } from '../services/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { IconError, IconMail, IconUser } from './ui/icon';

interface ContactInformationStepProps {
    onBack: () => void;
    onSubmit: (data: LoanFormData) => void;
    isSubmitted?: boolean;
}

export const ContactInformationStep = ({ onBack, onSubmit, isSubmitted = false }: ContactInformationStepProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useFormContext<LoanFormData>();

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
        } catch (e: any) {
            setSubmitError(e?.message || 'Submit failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    const disabled = isSubmitting || isSubmitted;

    return (
        <div className="animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="text-center mb-1 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-4" aria-hidden>
                    <IconUser className="w-6 h-6 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
            </div>

            {submitError && (
                <div className="mb-4 rounded-md border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">{submitError}</div>
            )}

            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3" noValidate>
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" aria-hidden>
                            <IconUser className="w-5 h-5 text-gray-400" />
                        </div>
                        <Input
                            {...register('fullName')}
                            id="fullName"
                            className="pl-10 pr-4"
                            placeholder="Enter your full name"
                            aria-invalid={!!errors.fullName}
                            aria-describedby="fullName-error"
                            disabled={disabled}
                            invalid={!!errors.fullName}
                        />
                    </div>
                    <div className="min-h-[20px] mt-2 flex items-center">
                        {errors.fullName ? (
                            <p id="fullName-error" className="text-sm text-red-600 flex items-center">
                                <IconError className="w-4 h-4 mr-1" />
                                {errors.fullName.message as string}
                            </p>
                        ) : (
                            <div className="text-sm">&nbsp;</div>
                        )}
                    </div>
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" aria-hidden>
                            <IconMail className="w-5 h-5 text-gray-400" />
                        </div>
                        <Input
                            {...register('email')}
                            id="email"
                            type="email"
                            className="pl-10 pr-4"
                            placeholder="Enter your email address"
                            aria-invalid={!!errors.email}
                            aria-describedby="email-error"
                            disabled={disabled}
                            invalid={!!errors.email}
                        />
                    </div>
                    <div className="min-h-[20px] mt-2 flex items-center">
                        {errors.email ? (
                            <p id="email-error" className="text-sm text-red-600 flex items-center">
                                <IconError className="w-4 h-4 mr-1" />
                                {errors.email.message as string}
                            </p>
                        ) : (
                            <div className="text-sm">&nbsp;</div>
                        )}
                    </div>
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" aria-hidden>
                            <span className="text-gray-500 text-sm font-medium">+61</span>
                        </div>
                        <Input
                            {...register('phoneNumber')}
                            id="phoneNumber"
                            inputMode="numeric"
                            maxLength={9}
                            className="pl-12 pr-4"
                            placeholder="Enter your phone number"
                            aria-invalid={!!errors.phoneNumber}
                            aria-describedby="phoneNumber-error"
                            disabled={disabled}
                            invalid={!!errors.phoneNumber}
                        />
                    </div>
                    <div className="min-h-[20px] mt-2 flex items-center">
                        {errors.phoneNumber ? (
                            <p id="phoneNumber-error" className="text-sm text-red-600 flex items-center">
                                <IconError className="w-4 h-4 mr-1" />
                                {errors.phoneNumber.message as string}
                            </p>
                        ) : (
                            <div className="text-sm">&nbsp;</div>
                        )}
                    </div>
                </div>

                <div className="flex space-x-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
                    <Button
                        type="button"
                        onClick={onBack}
                        className="flex-1"
                        variant="secondary"
                        disabled={disabled}
                    >
                        Back
                    </Button>
                    <Button
                        type="submit"
                        disabled={!isValid || disabled}
                        className={`flex-1 ${isSubmitted
                            ? 'bg-none bg-green-500 text-white cursor-not-allowed'
                            : isSubmitting
                                ? ' text-white cursor-wait'
                                : ''
                            }`}
                        aria-busy={isSubmitting}
                    >
                        {isSubmitted ? 'Submitted' : isSubmitting ? 'Submitting...' : 'Submit'}
                    </Button>
                </div>

                <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
                    <div className="flex items-center justify-center space-x-2">
                        <div className="w-3 h-3 bg-gray-300 rounded-full" aria-hidden />
                        <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" aria-label="Step 2 active" />
                    </div>
                </div>
            </form>
        </div>
    );
}; 