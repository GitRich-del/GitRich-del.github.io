/* scripts/default.js */

// Run scripts once the HTML DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    
    // 1. Automated Copyright Year
    // Keeps your footer updated automatically without hardcoding 2026
    const copyrightElement = document.querySelector("footer p");
    if (copyrightElement) {
        const currentYear = new Date().getFullYear();
        copyrightElement.innerHTML = `Page built by <a href="index.html">Siebenlist Solutions</a> ©${currentYear}`;
    }
});

// 3. Simple Interactive Function (Great for demonstrating JS capabilities to your professor)
function welcomeUser() {
    alert("Welcome to Richard Siebenlist Jr.'s ITIS3135 official course site!");
}