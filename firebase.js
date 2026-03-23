import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore, collection, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

// -------------------------
// 1️⃣ Firebase Configuration
// -------------------------
const firebaseConfig = {
    apiKey: "AIzaSyD8AHpHSdb1UuHG3b9V3v1YZCCAbaeaI7E",                       // Replace with your Firebase apiKey
    authDomain: "college-event-notifier-b050c.firebaseapp.com",   // Replace with your project authDomain
    projectId: "college-event-notifier-b050c",                    // Replace with your projectId
    storageBucket: "college-event-notifier-b050c.appspot.com",    // Replace with your storageBucket
    messagingSenderId: "208919168953",         // Replace with your messagingSenderId
    appId: "1:208919168953:web:7195d50017d25b6d165868"                          // Replace with your appId
};

// -------------------------
// 2️⃣ Initialize Firebase App
// -------------------------
export const app = initializeApp(firebaseConfig);

// -------------------------
// 3️⃣ Initialize Firestore
// -------------------------
export const db = getFirestore(app);

export const auth = getAuth(app);

// -------------------------
// 4️⃣ Initialize Messaging
// -------------------------
export const messaging = getMessaging(app);

// -------------------------
// 5️⃣ Request Notification Permission and Get Token
// -------------------------
Notification.requestPermission()
    .then(async (permission) => {
        if (permission === "granted") {
            console.log("Notification permission granted.");

            try {
                // Get FCM token
                const currentToken = await getToken(messaging, { vapidKey: "BCS_IQeNV1e30X3unT7l7fBon_vRlAMG4kv5J-HRBrhD3lOXjWfNNFSwSfACinepnR6Rpy9VW_Y2ZWgnO0-wllE" }); // Replace with your VAPID public key
                if (currentToken) {
                    console.log("FCM Token:", currentToken);

                    // Save token in Firestore
                    await setDoc(doc(db, "tokens", currentToken), {
                        createdAt: new Date()
                    });
                    console.log("Token saved in Firestore");
                } else {
                    console.log("No registration token available.");
                }
            } catch (err) {
                console.error("Error getting or saving FCM token:", err);
            }

        } else {
            console.log("Notification permission denied.");
        }
    })
    .catch((err) => {
        console.error("Error requesting notification permission:", err);
    });

// -------------------------
// 6️⃣ Listen for Messages While Page is Open
// -------------------------
onMessage(messaging, (payload) => {
    console.log("Message received:", payload);
    alert(`New Event: ${payload.notification.title}`);
});