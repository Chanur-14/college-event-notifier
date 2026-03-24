import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { app } from "./firebase.js";

const db = getFirestore(app);

let eventArray = [];

// Load events when page opens
window.addEventListener("DOMContentLoaded", () => {
    loadEvents();
});


// LOAD EVENTS FROM FIRESTORE
async function loadEvents() {

    const eventsContainer = document.getElementById("events-container");

    eventsContainer.innerHTML = "";

    eventArray = [];

    try {

        const querySnapshot = await getDocs(collection(db, "events"));

        querySnapshot.forEach((docItem) => {

            const event = docItem.data();

            event.id = docItem.id;

            eventArray.push(event);

        });

        displayEvents(eventArray);

    } catch (error) {

        console.error("Error loading events:", error);

    }

}


// DISPLAY EVENTS
function displayEvents(events) {

    const eventsContainer = document.getElementById("events-container");

    eventsContainer.innerHTML = "";

    events.forEach((event) => {

        const eventDiv = document.createElement("div");

        eventDiv.classList.add("event-card");

        eventDiv.innerHTML = `

<img src="${event.image}" class="event-img">

<h3>${event.eventName}</h3>

<p><b>Date:</b> ${event.date}</p>

<p><b>Hosted by:</b> ${event.hostCollege}</p>

<p class="countdown">${getCountdown(event.date)}</p>

<button onclick="registerEvent('${event.eventName}')">Register</button>

<button onclick="deleteEvent('${event.id}')">Delete</button>

`;

        eventsContainer.appendChild(eventDiv);

    });

}


// ADD EVENT
window.addEvent = async function () {

    const eventName = document.getElementById("eventName").value;
    const date = document.getElementById("date").value;
    const hostcollege = document.getElementById("hostCollege").value;
    const image = document.getElementById("eventimage").value;

    if (!eventName || !date || !hostCollege) {
        alert("Please fill all fields");
        return;
    }

    try {

        await addDoc(collection(db, "events"), {
            eventName: eventName,
            date: date,
            hostCollege: hostCollege,
            image: image
        });

        alert("Event Added");

        loadEvents();

    } catch (error) {

        console.error("Error adding event:", error);

    }

}


// DELETE EVENT
window.deleteEvent = async function (id) {

    try {

        await deleteDoc(doc(db, "events", id));

        alert("Event Deleted");

        loadEvents();

    } catch (error) {

        console.error("Delete error:", error);

    }

}


// REGISTER EVENT
window.registerEvent = async function (eventName) {

    const studentName = prompt("Enter your name to register");

    if (!studentName) {
        alert("Registration cancelled");
        return;
    }

    try {

        await addDoc(collection(db, "registrations"), {
            event: eventName,
            student: studentName,
            time: new Date()
        });

        alert("Registered for " + eventName);

    } catch (error) {

        console.error("Registration error:", error);

    }

}


// SORT EVENTS BY DATE
window.sortByDate = function () {

    eventArray.sort((a, b) => {

        return new Date(a.date) - new Date(b.date);

    });

    displayEvents(eventArray);

}


// SEARCH EVENTS
window.searchEvents = function () {

    const searchValue = document
        .getElementById("search")
        .value
        .toLowerCase();

    const filteredEvents = eventArray.filter(event =>
        event.eventName.toLowerCase().includes(searchValue)
    );

    displayEvents(filteredEvents);

}


// COUNTDOWN TIMER
function getCountdown(eventDate) {

    const today = new Date();
    const eventDay = new Date(eventDate);

    const diff = eventDay - today;

    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days > 0) {
        return "⏳ " + days + " days left";
    }
    else {
        return "⚡ Event Started";
    }

}