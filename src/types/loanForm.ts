import { z } from 'zod';

export const loanTypeEnum = z.enum(['Personal Loan', 'Home Loan', 'Car Loan'], {
    required_error: 'Please select your loan type',
});
export type LoanType = z.infer<typeof loanTypeEnum>;

export const loanFormSchema = z.object({
    // Step 1: Loan Details
    loanAmount: z
        .string()
        .regex(/^\d+$/, 'Please enter a valid positive number')
        .refine((v) => Number(v) > 0, 'Please enter a valid positive number'),
    loanType: z.preprocess((v) => (v === '' ? undefined : v), loanTypeEnum),

    // Step 2: Contact Information
    fullName: z.string().min(2, 'Name must be at least 2 characters long'),
    email: z.string().email('Please enter a valid email address'),
    // Stores only the 9 digits; +61 is a UI prefix
    phoneNumber: z.string().regex(/^\d{9}$/, 'Please enter a valid phone number'),
});

export type LoanFormData = z.infer<typeof loanFormSchema>;