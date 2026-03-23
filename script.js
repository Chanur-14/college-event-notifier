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

const eventsContainer = document.getElementById("events-container");

loadEvents();


// LOAD EVENTS
async function loadEvents() {

    eventsContainer.innerHTML = "";

    const querySnapshot = await getDocs(collection(db, "events"));

    querySnapshot.forEach((docItem) => {

        const event = docItem.data();

        const eventDiv = document.createElement("div");

        eventDiv.classList.add("event-card");

        eventDiv.innerHTML = `

<img src="${event.image}" class="event-img">

<h3>${event.eventName}</h3>

<p><b>Date:</b> ${event.date}</p>

<p><b>Hosted by:</b> ${event.hostCollege}</p>

<button onclick="registerEvent('${event.eventName}')">Register</button>

<button onclick="deleteEvent('${docItem.id}')">Delete</button>

`;

        eventsContainer.appendChild(eventDiv);

    });

}


// ADD EVENT
window.addEvent = async function () {
    const eventsContainer = document.getElementById("events-container");
    const eventName = document.getElementById("eventName").value;
    const date = document.getElementById("date").value;
    const hostCollege = document.getElementById("hostCollege").value;
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

        alert("Event Added Successfully");

        loadEvents();

    } catch (error) {

        console.error(error);
        alert("Error adding event");

    }

}


// DELETE EVENT
window.deleteEvent = async function (id) {

    try {

        await deleteDoc(doc(db, "events", id));

        alert("Event Deleted");

        loadEvents();

    } catch (error) {

        console.error(error);

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

        alert("Successfully Registered for " + eventName);

    } catch (error) {

        console.error(error);
        alert("Registration failed");

    }

}


// SEARCH EVENTS
window.searchEvents = function () {

    const searchValue = document.getElementById("search").value.toLowerCase();

    const events = document.getElementsByClassName("event-card");

    for (let i = 0; i < events.length; i++) {

        let title = events[i].getElementsByTagName("h3")[0];

        if (title.innerHTML.toLowerCase().includes(searchValue)) {
            events[i].style.display = "block";
        }
        else {
            events[i].style.display = "none";
        }

    }

}