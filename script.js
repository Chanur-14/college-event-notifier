import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { app } from "./firebase.js";

// Guard: ensure app is initialized before proceeding
if (!app) {
    console.error("Firebase app not initialized. Check firebase.js");
}

const db = getFirestore(app);

let eventArray = [];

// ─── LOAD ON DOM READY ───────────────────────────────────────────
window.addEventListener("DOMContentLoaded", () => {
    loadEvents();
});


// ─── LOAD EVENTS FROM FIRESTORE ──────────────────────────────────
async function loadEvents() {
    const eventsContainer = document.getElementById("events-container");
    eventsContainer.innerHTML = "<p>Loading events...</p>";
    eventArray = [];

    try {
        const q = query(collection(db, "events"), orderBy("date"));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            eventsContainer.innerHTML = "<p>No events found.</p>";
            return;
        }

        querySnapshot.forEach((docItem) => {
            const event = { id: docItem.id, ...docItem.data() };
            eventArray.push(event);
        });

        displayEvents(eventArray);

    } catch (error) {
        console.error("Error loading events:", error);
        eventsContainer.innerHTML = "<p>Failed to load events. Please try again.</p>";
    }
}


// ─── DISPLAY EVENTS ──────────────────────────────────────────────
function displayEvents(events) {
    const eventsContainer = document.getElementById("events-container");
    eventsContainer.innerHTML = "";

    if (events.length === 0) {
        eventsContainer.innerHTML = "<p>No matching events found.</p>";
        return;
    }

    events.forEach((event) => {
        const eventDiv = document.createElement("div");
        eventDiv.classList.add("event-card");

        eventDiv.innerHTML = `
      <img src="${event.image || 'placeholder.jpg'}" class="event-img" alt="${event.eventName}">
      <h3>${event.eventName}</h3>
      <p><b>Date:</b> ${event.date}</p>
      <p><b>Hosted by:</b> ${event.hostcollege}</p>
      <p class="countdown">${getCountdown(event.date)}</p>
      <button onclick="registerEvent('${event.eventName}')">Register</button>
      <button onclick="deleteEvent('${event.id}')">Delete</button>
    `;

        eventsContainer.appendChild(eventDiv);
    });
}


// ─── ADD EVENT ───────────────────────────────────────────────────
window.addEvent = async function () {
    const eventName = document.getElementById("eventName").value.trim();
    const date = document.getElementById("date").value.trim();
    const hostcollege = document.getElementById("hostcollege").value.trim();
    const image = document.getElementById("eventimage").value.trim();

    if (!eventName || !date || !hostcollege) {
        alert("Please fill all required fields.");
        return;
    }

    try {
        await addDoc(collection(db, "events"), {
            eventName,
            date,
            hostcollege,
            image: image || "",
            createdAt: new Date()
        });

        alert("✅ Event Added Successfully!");

        // Clear form fields
        document.getElementById("eventName").value = "";
        document.getElementById("date").value = "";
        document.getElementById("hostcollege").value = "";
        document.getElementById("eventimage").value = "";

        loadEvents();

    } catch (error) {
        console.error("Error adding event:", error);
        alert("Failed to add event. Check console.");
    }
};


// ─── DELETE EVENT ────────────────────────────────────────────────
window.deleteEvent = async function (id) {
    const confirmed = confirm("Are you sure you want to delete this event?");
    if (!confirmed) return;

    try {
        await deleteDoc(doc(db, "events", id));
        alert("🗑️ Event Deleted.");
        loadEvents();

    } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete event. Check console.");
    }
};


// ─── REGISTER EVENT ──────────────────────────────────────────────
window.registerEvent = async function (eventName) {
    const studentName = prompt("Enter your name to register:");

    if (!studentName || studentName.trim() === "") {
        alert("Registration cancelled.");
        return;
    }

    try {
        await addDoc(collection(db, "registrations"), {
            event: eventName,
            student: studentName.trim(),
            time: new Date()
        });

        alert(`✅ Successfully registered for "${eventName}"!`);

    } catch (error) {
        console.error("Registration error:", error);
        alert("Registration failed. Check console.");
    }
};


// ─── SORT EVENTS BY DATE ─────────────────────────────────────────
window.sortByDate = function () {
    const sorted = [...eventArray].sort((a, b) => new Date(a.date) - new Date(b.date));
    displayEvents(sorted);
};


// ─── SEARCH EVENTS ───────────────────────────────────────────────
window.searchEvents = function () {
    const searchValue = document.getElementById("search").value.toLowerCase().trim();

    const filtered = eventArray.filter(event =>
        event.eventName.toLowerCase().includes(searchValue) ||
        event.hostcollege.toLowerCase().includes(searchValue)
    );

    displayEvents(filtered);
};


// ─── COUNTDOWN TIMER ─────────────────────────────────────────────
function getCountdown(eventDate) {
    const today = new Date();
    const eventDay = new Date(eventDate);
    const diff = eventDay - today;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days > 1) return `⏳ ${days} days left`;
    if (days === 1) return `⏳ Tomorrow!`;
    if (days === 0) return `🔥 Today!`;
    return `✅ Event Completed`;
}