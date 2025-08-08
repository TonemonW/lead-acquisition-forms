import axios from 'axios';

export interface SubmitLeadPayload {
    fullName: string;
    email: string;
    phoneNumber: string; // includes +61 prefix when sent
    loanType: string;
    loanAmount: string;
}

const getSubmitUrl = (): string => {
    // Expect full URL in env, fallback to relative path
    const raw = (import.meta as unknown as { env?: { VITE_FUNCTIONS_BASE_URL?: string } }).env?.VITE_FUNCTIONS_BASE_URL;
    if (!raw) return '/submitLead';
    const cleaned = raw.trim().replace(/^@/, '');
    return cleaned.length > 0 ? cleaned : '/submitLead';
};

export const submitLead = async (payload: SubmitLeadPayload): Promise<void> => {
    const url = getSubmitUrl();
    await axios.post(url, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 15000,
    });
}; 