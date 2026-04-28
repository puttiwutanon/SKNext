importScripts('https://www.gstatic.com/firebasejs/12.12.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.12.1/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyB6oECHJqQwkKVdGW8fcwWwL5DeAJUHVQo",
    projectId: "sknscapp",
    messagingSenderId: "1014040420408",
    appId: "1:1014040420408:web:778a3d80d47c1eea8b86cd",
    storageBucket: "sknscapp.firebasestorage.app",
    authDomain: "sknscapp.firebaseapp.com",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: '/icon.png',
        vibrate: [200, 100, 200] // buzz pattern
    });
});