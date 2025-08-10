import axios from 'axios';

export interface ISubmitLeadPayload {
    fullName: string;
    email: string;
    phoneNumber: string; // includes +61 prefix when sent
    loanType: string;
    loanAmount: string;
}

const getSubmitUrl = (): string => {
    const raw = import.meta.env.VITE_FUNCTIONS_BASE_URL as string | undefined;
    return raw && raw.trim() ? raw.trim() : '/submitLead';
};

export const submitLead = async (payload: ISubmitLeadPayload): Promise<void> => {
    const url = getSubmitUrl();
    await axios.post(url, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 15000,
    });
}; 