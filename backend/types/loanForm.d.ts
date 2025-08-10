import type { z } from 'zod';
export declare const loanFormSchema: z.ZodObject<{
    loanAmount: z.ZodEffects<z.ZodString, string, string>;
    loanType: z.ZodEffects<z.ZodTypeAny, any, any>;
    fullName: z.ZodString;
    email: z.ZodString;
    phoneNumber: z.ZodString;
}, "strip", z.ZodTypeAny, {
    loanAmount: string;
    loanType?: any;
    fullName: string;
    email: string;
    phoneNumber: string;
}, {
    loanAmount: string;
    loanType?: any;
    fullName: string;
    email: string;
    phoneNumber: string;
}>;
export type LoanFormData = z.infer<typeof loanFormSchema>;


