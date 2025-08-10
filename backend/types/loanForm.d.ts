import { z } from 'zod';
export declare const loanTypeEnum: z.ZodEnum<["Personal Loan", "Home Loan", "Car Loan"]>;
export type LoanType = z.infer<typeof loanTypeEnum>;
export declare const loanFormSchema: z.ZodObject<{
    loanAmount: z.ZodEffects<z.ZodString, string, string>;
    loanType: z.ZodEffects<z.ZodEnum<["Personal Loan", "Home Loan", "Car Loan"]>, "Personal Loan" | "Home Loan" | "Car Loan", unknown>;
    fullName: z.ZodString;
    email: z.ZodString;
    phoneNumber: z.ZodString;
}, "strip", z.ZodTypeAny, {
    loanAmount: string;
    loanType: "Personal Loan" | "Home Loan" | "Car Loan";
    fullName: string;
    email: string;
    phoneNumber: string;
}, {
    loanAmount: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    loanType?: unknown;
}>;
export type LoanFormData = z.infer<typeof loanFormSchema>;
