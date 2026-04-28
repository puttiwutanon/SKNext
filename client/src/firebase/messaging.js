import { getMessaging, getToken } from 'firebase/messaging';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from './firebaseConfig';

export const requestNotificationPermission = async (userId) => {
    try {
        if (!('serviceWorker' in navigator)) {
            console.error('Service workers not supported');
            return;
        }

        await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log('Service worker registered');
        
        const messaging = getMessaging();

        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return;

        const token = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_VAPID_PUBLIC_KEY
        });

        // Creates the document if it doesn't exist, updates if it does
        await setDoc(doc(db, 'users', userId), {
            uid: userId,
            email: auth.currentUser?.email,
            fcmToken: token,
            role: 'student',
            createdAt: new Date(),
        }, { merge: true });

        console.log('FCM token saved:', token);
    } catch (err) {
        console.error('Notification permission error:', err);
    }
};