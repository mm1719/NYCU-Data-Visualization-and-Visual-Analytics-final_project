import { getData } from "./deathData.js";

// Function to handle the click event on buttons
function handleButtonClick(event) {
    // Remove the "active" class from all buttons
    document.querySelectorAll(".year").forEach(button => {
        button.classList.remove("active");
    });
    // Add the "active" class to the clicked button
    const clickedButton = event.currentTarget;
    //console.log(clickedButton);
    clickedButton.classList.add("active");

    // Get the bounding rectangle of the clicked button
    const buttonRect = clickedButton.getBoundingClientRect();
    // Calculate the X position of the center of the button
    const buttonCenterX = buttonRect.left + buttonRect.width / 2;

    // Assuming the triangle has a width of 25px, subtract half of its width to center it
    const triangleHalfWidth = 20; // Half of the triangle"s width
    const triangleNewX = buttonCenterX - triangleHalfWidth;

    // Move the triangle to the new X position
    const triangle = document.getElementById("draggable-triangle");
    triangle.style.transform = `translate(${triangleNewX}px, -220px)`;

    //setTriangle(clickedButton);
}

function setActiveButton(selectedYear) {
    // Find all buttons
    const buttons = document.querySelectorAll(".year");
    //console.log(buttons);
    // Remove the "active" class from all buttons
    buttons.forEach(button => {
        button.classList.remove("active");
    });

    // Add the "active" class to the button with the matching "data-year"
    buttons.forEach(button => {
        if (button.getAttribute("data-year") === selectedYear) {
            button.classList.add("active");
            setTriangle(button);
            handleYearSelection(selectedYear);
        }
    });
}

function setTriangle(button) {
    // Get the bounding rectangle of the clicked button
    const buttonRect = button.getBoundingClientRect();
    // Calculate the X position of the center of the button
    const buttonCenterX = buttonRect.left + buttonRect.width / 2;

    // Assuming the triangle has a width of 20px, subtract half of its width to center it
    const triangleHalfWidth = 20; // Half of the triangle"s width
    const triangleNewX = buttonCenterX - triangleHalfWidth;

    // Move the triangle to the new X position
    const triangle = document.getElementById("draggable-triangle");
    triangle.style.transform = `translate(${triangleNewX}px, -220px)`;
}

function handleYearSelection(year) {
    const prev = sessionStorage.getItem("selectedYear");
    sessionStorage.setItem("selectedYear", year); //localStorage.setItem/getItem would store the item even the computer restarts
    updateTitle(year);
    if (prev !== year) getData();
}

function updateTitle(year) {
    d3.select("#year")
        .text(`in ${year}`);
}


window.addEventListener("DOMContentLoaded", (event) => {
    const selectedYear = sessionStorage.getItem("selectedYear");
    if (selectedYear) {
        // Find and activate the button for the selected year
        setActiveButton(selectedYear);
    }
});

// Add the event listener to all year buttons
document.querySelectorAll(".year").forEach(button => {
    button.addEventListener("click", (event) => {
        handleButtonClick(event);
        const year = event.currentTarget.getAttribute("data-year");
        handleYearSelection(year);
    });
});


// Get the position of each button
const buttonInfo = Array.from(document.querySelectorAll(".year")).map((button, index) => {
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2; // Get the center X-coordinate of the button
    const triangleHalfWidth = 20;
    const year = (index + 1990).toString();

    return { position: centerX, year: year};
});
//console.log(buttonInfo);

const leftBoundary = buttonInfo[0].position - 20;
const rightBoundary = buttonInfo[buttonInfo.length - 1].position - 20;
const triangle = document.getElementById("draggable-triangle");
let isDragging = false;
let dragOffsetX = 0;

triangle.addEventListener("mousedown", function (event) {
   isDragging = true;
   let triangleRect = triangle.getBoundingClientRect();
   dragOffsetX = event.clientX - triangleRect.left;
   event.preventDefault(); // Prevent default action (e.g., text selection)
});

document.addEventListener("mousemove", function (event) {
    if(isDragging) {
        let triangleX = event.clientX - dragOffsetX;
        //console.log(triangleX);
        triangleX = Math.max(triangleX, leftBoundary);
        triangleX = Math.min(triangleX, rightBoundary + 20);
        
        triangle.style.transform = `translate(${triangleX}px, -170px)`;

        const nearest = buttonInfo.reduce((nearest, current) => {
            return (Math.abs(current.position - triangleX) < Math.abs(nearest.position - triangleX)) ? current : nearest;
        }, { position: Infinity, year: "" });
        
        setActiveButton(nearest.year);
    }
})

document.addEventListener("mouseup", function (event) {
    if (isDragging) {
        isDragging = false;
        /*// Get the current position of the triangle
        const triangleRect = triangle.getBoundingClientRect();
        const triangleHalfWidth = 20;
        const triangleCenterX = triangleRect.left + triangleHalfWidth;
    
        // Find the nearest button position
        const nearest = buttonInfo.reduce((nearest, current) => {
            return (Math.abs(current.position - triangleCenterX) < Math.abs(nearest.position - triangleCenterX)) ? current : nearest;
        }, { position: Infinity, year: "" });
        
        //setActiveButton(nearest.year);

        // Calculate the new position for the triangle
        const triangleNewX = nearest.position - triangleHalfWidth;
        
        // Move the triangle to the new position
        triangle.style.transform = `translate(${triangleNewX}px, -170px)`;*/
    }
})