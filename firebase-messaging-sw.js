// firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');
firebase.initializeApp({
    apiKey: "AIzaSyD8AHpHSdb1UuHG3b9V3v1YZCCAbaeaI7E",
    authDomain: "college-event-notifier.firebaseapp.com",
    projectId: "college-event-notifier",
    storageBucket: "college-event-notifier.appspot.com",
    messagingSenderId: "208919168953",
    appId: "1:208919168953:web:7195d50017d25b6d165868"
});

const messaging = firebase.messaging();