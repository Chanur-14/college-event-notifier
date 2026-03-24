import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyD8AHpHSdb1UuHG3b9V3v1YZCCAbaeaI7E",
    authDomain: "college-event-notifier-b050c.firebaseapp.com",
    projectId: "college-event-notifier-b050c",
    storageBucket: "college-event-notifier-b050c.appspot.com",
    messagingSenderId: "208919168953",
    appId: "1:208919168953:web:7195d50017d25b6d165868"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const messaging = getMessaging(app);

// Request Notification + Save FCM Token
Notification.requestPermission().then(async (permission) => {
    if (permission !== "granted") return;

    console.log("Notification permission granted.");

    try {
        const currentToken = await getToken(messaging, {
            vapidKey: "BCS_IQeNV1e30X3unT7l7fBon_vRlAMG4kv5J-HRBrhD3lOXjWfNNFSwSfACinepnR6Rpy9VW_Y2ZWgnO0-wllE"
        });

        if (currentToken) {
            console.log("FCM Token:", currentToken);
            await setDoc(doc(db, "tokens", currentToken), {
                createdAt: new Date()
            });
            console.log("Token saved in Firestore");
        } else {
            console.log("No token available.");
        }
    } catch (err) {
        console.error("Error getting or saving FCM token:", err);
    }
});

// Listen for foreground messages
onMessage(messaging, (payload) => {
    console.log("Message received:", payload);
    alert(`New Event: ${payload.notification.title}`);
});