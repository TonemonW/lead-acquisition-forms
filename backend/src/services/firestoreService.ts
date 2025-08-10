import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';



initializeApp();
const db = getFirestore();

export const saveLeadToFirestore = async (
    lead: { fullName: string; email: string; phoneNumber: string; loanType: string; loanAmount: string | number }
): Promise<string> => {
    const leadsRef = db.collection('leads');
    const docRef = await leadsRef.add({
        ...lead,
        createdAt: FieldValue.serverTimestamp(),
    });
    return docRef.id;
};
