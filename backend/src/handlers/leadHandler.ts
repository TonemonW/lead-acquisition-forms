import { Request, Response } from 'express';
import { saveLeadToFirestore } from '../services/firestoreService.js';
import * as logger from 'firebase-functions/logger';
import { loanFormSchema } from '../../types/loanForm.js';

const isProd = process.env.NODE_ENV === 'production';

export const handleLeadSubmit = async (req: Request, res: Response): Promise<void> => {
    try {
        if (req.method !== 'POST') {
            res.status(405).json({ error: 'Method Not Allowed' });
            return;
        }

        const body = req.body ?? {};

        // Normalize incoming payload to match shared Zod schema expectations
        const loanAmountStr: string = typeof body.loanAmount === 'number' ? String(body.loanAmount) : String(body.loanAmount ?? '');
        const normalizedPhoneDigits = (() => {
            const raw = String(body.phoneNumber ?? '').replace(/\D+/g, '');
            if (raw.startsWith('61')) return raw.slice(2);
            if (raw.startsWith('0')) return raw.slice(1);
            return raw;
        })();

        const candidate = {
            fullName: String(body.fullName ?? ''),
            email: String(body.email ?? ''),
            loanType: body.loanType,
            loanAmount: loanAmountStr,
            phoneNumber: normalizedPhoneDigits,
        } as unknown;

        const parsed = loanFormSchema.safeParse(candidate);
        if (!parsed.success) {
            const flattened = parsed.error.flatten().fieldErrors as Record<string, string[] | undefined>;
            const fieldErrors = Object.fromEntries(
                Object.entries(flattened).map(([key, arr]) => [key, (arr && arr[0]) || 'Invalid'])
            );
            res.status(400).json({ error: 'data_validation_failed', details: fieldErrors });
            return;
        }

        const { fullName, email, loanType, phoneNumber } = parsed.data;
        const normalizedLead = { fullName, email, phoneNumber: `+61${phoneNumber}`, loanType, loanAmount: parsed.data.loanAmount };

        let id: string;
        try {
            id = await saveLeadToFirestore(normalizedLead);
        } catch (fireErr: any) {
            logger.error('Firestore write failed', { error: fireErr });
            res.status(500).json({
                error: 'firestore_write_failed',
                details: { message: fireErr?.message || String(fireErr), code: fireErr?.code },
            });
            return;
        }

        res.status(200).json({ id, message: 'Write successful' });
    } catch (error: any) {
        logger.error('Lead submission error', { error });
        res.status(500).json({
            error: 'Internal server error',
            ...(isProd ? {} : { details: error?.message || String(error) }),
        });
    }
};
