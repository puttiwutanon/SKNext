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
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();
    if (!userData) return;

    // Web Push (works when tab closed if PWA installed)
    if (userData.fcmToken) {
        await admin.messaging().send({
            token: userData.fcmToken,
            notification: {
                title: 'หมดเวลาใช้โต๊ะอาหาร',
                body: `โต๊ะ ${tableId} ของคุณหมดเวลาแล้ว กรุณาเก็บของและออกจากโต๊ะ`
            },
            android: { priority: 'high' },
        });
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