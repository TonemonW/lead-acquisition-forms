import { Request, Response } from 'express';
import { saveLeadToFirestore } from '../services/firestoreService.js';

const isProd = process.env.NODE_ENV === 'production';

export const handleLeadSubmit = async (req: Request, res: Response): Promise<void> => {
    try {
        if (req.method !== 'POST') {
            res.status(405).json({ error: 'Method Not Allowed' });
            return;
        }

        const leadData = req.body ?? {};
        const { email, loanAmount, fullName, phoneNumber, loanType } = leadData;

        if (!email || !loanAmount || !fullName || !phoneNumber || !loanType) {
            res.status(400).json({
                error: 'Missing required fields',
                received: { email: !!email, loanAmount: !!loanAmount, fullName: !!fullName, phoneNumber: !!phoneNumber, loanType: !!loanType },
            });
            return;
        }

        const normalizedLead = { fullName, email, phoneNumber, loanType, loanAmount };

        try {
            await saveLeadToFirestore(normalizedLead);
        } catch (fireErr: any) {
            console.error('Firestore write failed:', fireErr);
            res.status(500).json({
                error: 'firestore_write_failed',
                details: { message: fireErr?.message || String(fireErr), code: fireErr?.code },
            });
            return;
        }

        res.status(200).json({ message: 'Lead submitted successfully' });
    } catch (error: any) {
        console.error('Lead submission error:', error);
        res.status(500).json({
            error: 'Internal server error',
            ...(isProd ? {} : { details: error?.message || String(error) }),
        });
    }
};
