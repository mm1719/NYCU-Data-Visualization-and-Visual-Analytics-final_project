import { getData } from "./deathData.js";

const dropbtn = document.querySelector(".dropbtn");

dropbtn.onclick = function() {
    document.querySelector(".dropdown-content").classList.toggle("show");
}

window.onclick = function(event) {
    if (!event.target.matches(".dropbtn")) {
        const dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.classList.contains("show")) {
                openDropdown.classList.remove("show");
            }
        }
    }
}

document.querySelectorAll(".dropdown .option").forEach(option => {
    option.addEventListener("click", function(event) {
        // Prevent default link behavior
        event.preventDefault();

        // Get the data-value attribute of the clicked option
        const value = this.getAttribute("data-value");

        // Find the dropdown button and update its text content
        const dropbtn = this.closest(".dropdown").querySelector(".dropbtn");
        dropbtn.textContent = value;

        dropbtn.classList.add("selected");
        
        const prev = sessionStorage.getItem("selectedDeathCause");
        sessionStorage.setItem("selectedDeathCause", value);
        if (prev !== value) getData();
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const selectedDeathCause = sessionStorage.getItem("selectedDeathCause");
    if (selectedDeathCause) {
        const dropbtn = document.querySelector(".dropbtn");
        dropbtn.textContent = selectedDeathCause;
        
        dropbtn.classList.add("selected");
    }
});