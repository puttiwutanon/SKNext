import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from './firebaseConfig';

let fcm = null;

const initMessaging = async () => {
    if (fcm) return fcm;
    const { getMessaging, getToken, onMessage } = await import('firebase/messaging');
    fcm = { messaging: getMessaging(), getToken, onMessage };
    return fcm;
};

export const requestNotificationPermission = async (userId) => {
    try {
        if (!('serviceWorker' in navigator)) {
            console.error('Service workers not supported');
            return;
        }

        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log('Service worker registered');

        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            console.warn('Notification permission denied');
            return;
        }

        const { messaging, getToken } = await initMessaging();

        const token = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
            serviceWorkerRegistration: registration,
        });

        if (!token) {
            console.warn('No FCM token received');
            return;
        }

        const userDoc = await getDoc(doc(db, 'users', userId));
        const existingTokens = userDoc.data()?.fcmTokens || [];

        if (!existingTokens.includes(token)) {
            existingTokens.push(token);
        }

        await setDoc(doc(db, 'users', userId), {
            uid: userId,
            email: auth.currentUser?.email,
            fcmTokens: existingTokens,
            role: 'student',
            createdAt: new Date(),
        }, { merge: true });

        console.log('FCM token saved:', token);

        await setupForegroundNotifications();

    } catch (err) {
        console.error('Notification permission error:', err);
    }
};

export const setupForegroundNotifications = async () => {
    try {
        if (!('serviceWorker' in navigator)) return;

        const { messaging, onMessage } = await initMessaging();

        onMessage(messaging, (payload) => {
            console.log('Foreground message received:', payload);
            if (Notification.permission !== 'granted') return;

            navigator.serviceWorker.ready.then((registration) => {
                registration.showNotification(
                    payload.notification?.title || 'New Notification',
                    {
                        body: payload.notification?.body,
                        icon: '/icon.png',
                        vibrate: [200, 100, 200],
                        requireInteraction: true,
                    }
                );
            });
        });

        console.log('Foreground notification listener attached');
    } catch (err) {
        console.error('Foreground notification setup error:', err);
    }
};