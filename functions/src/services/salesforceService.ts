import axios from "axios";

const SALESFORCE_ENDPOINT = process.env.SALESFORCE_ENDPOINT || "https://your.salesforce.endpoint"; // Replace in env
const SALESFORCE_TOKEN = process.env.SALESFORCE_TOKEN || ""; // Store securely!

const isConfigured = (): boolean => {
    if (!SALESFORCE_ENDPOINT || SALESFORCE_ENDPOINT.includes("your.salesforce.endpoint")) return false;
    if (!SALESFORCE_TOKEN) return false;
    return true;
};

export const sendLeadToSalesforce = async (lead: { fullName: string; email: string; phoneNumber: string; loanType: string; loanAmount: string | number; }) => {
    if (!isConfigured()) {
        console.warn("Salesforce is not configured. Skipping send.");
        return;
    }
    try {
        await axios.post(
            SALESFORCE_ENDPOINT,
            {
                fullName: lead.fullName,
                email: lead.email,
                phoneNumber: lead.phoneNumber,
                loanType: lead.loanType,
                loanAmount: lead.loanAmount,
            },
            {
                headers: {
                    Authorization: `Bearer ${SALESFORCE_TOKEN}`,
                    "Content-Type": "application/json",
                },
                timeout: 10000,
            }
        );
    } catch (error: any) {
        console.error("Salesforce error (non-fatal):", error?.response?.data || error.message);
        // Fail-soft: do not rethrow to avoid breaking user submissions
    }
};
