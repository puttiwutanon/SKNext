const express = require('express');
const admin = require('firebase-admin');
const webpush = require('web-push');
const cron = require('node-cron');
const config = require('./config');

const app = express();
app.use(express.json());

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: config.firebase.projectId,
        clientEmail: config.firebase.clientEmail,
        privateKey: config.firebase.privateKey,
    })
});

const db = admin.firestore();

// Initialize Web Push
webpush.setVapidDetails(
    `mailto:${config.webPush.email}`,
    config.webPush.publicKey,
    config.webPush.privateKey
);

const sendNotification = async (userId, tableId) => {
    try {
        const userDoc = await db.collection('users').doc(userId).get();
        const userData = userDoc.data();
        
        if (!userData) {
            console.log('No user data found for:', userId);
            return;
        }

        const tokens = userData.fcmTokens || [];
        console.log('Tokens found:', tokens.length);
        
        if (tokens.length === 0) {
            console.log('No FCM tokens for user:', userId);
            return;
        }

        const response = await admin.messaging().sendEachForMulticast({
            tokens: tokens,
            notification: {
                title: 'หมดเวลาใช้โต๊ะอาหาร',
                body: `โต๊ะ ${tableId} ของคุณหมดเวลาแล้ว กรุณาเก็บของและออกจากโต๊ะ`
            },
            android: { priority: 'high' },
        });

        // Log results for each token
        console.log('Sent:', response.successCount, 'Success,', response.failureCount, 'Failed');
        response.responses.forEach((resp, i) => {
            if (!resp.success) {
                console.log(`Token ${i} failed:`, resp.error?.code, resp.error?.message);
            }
        });

    } catch (err) {
        console.error('sendNotification error:', err.message);
    }
};

// ── Check expired tables every minute ─────────────────────────
cron.schedule('* * * * *', async () => {
    console.log('Checking expired tables...');
    const now = admin.firestore.Timestamp.now();

    const expiredTables = await db.collection('tables')
        .where('status', '==', 'occupied')
        .where('occupiedUntil', '<=', now)
        .get();

    for (const tableDoc of expiredTables.docs) {
        const data = tableDoc.data();
        if (!data.reservedBy) continue;

        console.log(`Table ${data.tableId} expired, notifying user...`);

        await sendNotification(data.reservedBy, data.tableId);

        await tableDoc.ref.update({
            status: 'available',
            reservedBy: null,
            timerStartsAt: null,
            occupiedUntil: null,
        });
    }
});

// ── Routes (for future expansion) ─────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});