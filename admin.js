import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
window.addEvent = async function () {
    const eventName = document.getElementById("eventName").value;
    const date = document.getElementById("date").value;
    const hostCollege = document.getElementById("hostCollege").value;
    if (!eventName || !date || !hostCollege) {
        alert("Please fill all fields");
        return;
    }
    await addDoc(collection(db, "events"), {
        eventName: eventName,
        date: date,
        hostCollege: hostCollege
    });
    alert("Event Added Successfully!");
};

function adminLogin() {

    const username = document.getElementById("adminUser").value;
    const password = document.getElementById("adminPass").value;

    if (username === "admin" && password === "1234") {

        alert("Login Successful");

        window.location.href = "index.html";

    } else {

        alert("Invalid Login");

    }

}