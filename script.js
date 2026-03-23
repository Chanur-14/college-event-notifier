// Firebase imports
import { db } from "./firebase.js";
import { auth } from "./firebase.js";

import { collection, getDocs, addDoc, deleteDoc, doc }
    from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

import { signInWithEmailAndPassword }
    from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";


// Load events from Firestore
async function loadEvents() {

    const eventList = document.getElementById("eventList");

    if (!eventList) return;

    eventList.innerHTML = "";

    const querySnapshot = await getDocs(collection(db, "events"));

    let eventsArray = [];

    querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const id = docSnap.id;

        eventsArray.push({
            id: id,
            eventName: data.eventName,
            date: data.date,
            hostCollege: data.hostCollege
        });
    });

    // sort by date
    eventsArray.sort((a, b) => new Date(a.date) - new Date(b.date));

    eventsArray.forEach(event => {

        const eventDiv = document.createElement("div");
        eventDiv.classList.add("event-card");
        eventDiv.innerHTML = `
        <div class="event-card">
        <img src="${event.image}"
        class="event-img">
        
        <h3>${event.eventName}</h3>
        <p><b>Date:</b> ${event.date}</p>
        <p><b>Hosted by:</b> ${event.hostCollege}</p>
        <button onclick="registerEvent('${event.eventName}')">Register</button>
        <button class="delete-btn" onclick="deleteEvent('${event.id}')">Delete</button>
        </div>
        `;
        eventList.appendChild(eventDiv);

    });

}

loadEvents();


// Add Event
window.addEvent = async function () {
    const image = document.getElementById("eventimage").value;
    const eventName = document.getElementById("eventName").value;
    const date = document.getElementById("date").value;
    const hostCollege = document.getElementById("hostCollege").value;
    addDoc(collection(db, "events"), {
        eventName: eventName,
        date: date,
        hostCollege: hostCollege,
        image: image
    });
    alert("Event Added Successfully");

}


// Delete Event
window.deleteEvent = async function (id) {

    try {

        await deleteDoc(doc(db, "events", id));

        alert("Event Deleted");

        location.reload();

    } catch (error) {

        console.error(error);

    }

}


// Admin Login
window.loginAdmin = async function () {

    const email = document.getElementById("adminEmail").value;
    const password = document.getElementById("adminPassword").value;

    try {

        await signInWithEmailAndPassword(auth, email, password);

        alert("Login Successful");

        document.getElementById("adminPanel").style.display = "block";

    } catch (error) {

        alert("Login Failed");

    }

}


// Navigation Scroll
document.querySelectorAll("nav a").forEach(link => {

    link.addEventListener("click", function (e) {

        e.preventDefault();

        const section = document.querySelector(this.getAttribute("href"));

        if (section) {

            section.scrollIntoView({
                behavior: "smooth"
            });

        }

    });

});

window.searchEvents = function () {
    const input = document.getElementById("search").value.toLowerCase();
    const events = document.querySelectorAll("#eventList div");
    events.forEach(event => {

        const text = event.innerText.toLowerCase();
        if (text.includes(input)) {
            event.style.display = "block";
        }
        else {
            event.style.display = "none";

        }
    });
}

window.registerEvent = function (eventName) {
    alert("You have successfully registered for " + eventName);
}