import { onRequest } from 'firebase-functions/v2/https';
import { handleLeadSubmit } from './handlers/leadHandler.js';

export const submitLead = onRequest({ region: 'australia-southeast1', cors: '*' }, async (req, res) => {
    await handleLeadSubmit(req as any, res as any);
});
