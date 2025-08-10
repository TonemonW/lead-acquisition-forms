import axios from "axios";
import * as logger from "firebase-functions/logger";

const SALESFORCE_ENDPOINT = (process.env.SALESFORCE_ENDPOINT ?? "").trim();
const SALESFORCE_TOKEN = (process.env.SALESFORCE_TOKEN ?? "").trim();

const isConfigured = (): boolean => Boolean(SALESFORCE_ENDPOINT && SALESFORCE_TOKEN);

export const sendLeadToSalesforce = async (lead: { fullName: string; email: string; phoneNumber: string; loanType: string; loanAmount: string | number; }) => {
    if (!isConfigured()) {
        logger.warn("Salesforce is not configured. Skipping send.");
        return;
    }
    try {
        const endpoint = SALESFORCE_ENDPOINT as string;
        const token = SALESFORCE_TOKEN as string;
        await axios.post(
            endpoint,
            {
                fullName: lead.fullName,
                email: lead.email,
                phoneNumber: lead.phoneNumber,
                loanType: lead.loanType,
                loanAmount: lead.loanAmount,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                timeout: 10000,
            }
        );
    } catch (error: any) {
        logger.error("Salesforce error (non-fatal)");
        // Fail-soft: do not rethrow to avoid breaking user submissions
    }
};
