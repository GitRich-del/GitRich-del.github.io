
// Automatically executes when the webpage finishes loading
document.addEventListener("DOMContentLoaded", () => {
    console.log("Scripts folder connected successfully.");
    displayCurrentDateTime();
});

// Displays a real-time localized date and time stamp in the page layout
function displayCurrentDateTime() {
    const dateTarget = document.getElementById("current-date-time");
    if (dateTarget) {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        dateTarget.innerText = `Today is ${now.toLocaleDateString('en-US', options)}`;
    }
}








