/* scripts/default.js */

// Run scripts once the HTML DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    
    // 1. Dynamic Validation Links (Replaces the inline scripts from your footer)
    const htmlLink = document.getElementById("validation_link_html");
    const cssLink = document.getElementById("validation_link_css");

    if (htmlLink) {
        htmlLink.setAttribute("href", "https://validator.w3.org/nu/?doc=" + encodeURIComponent(window.location.href));
    }
    if (cssLink) {
        cssLink.setAttribute("href", "https://jigsaw.w3.org/css-validator/validator?uri=" + encodeURIComponent(window.location.href));
    }

    // 2. Automated Copyright Year
    // Keeps your footer updated automatically without hardcoding 2026
    const copyrightElement = document.querySelector("footer p");
    if (copyrightElement) {
        const currentYear = new Date().getFullYear();
        copyrightElement.innerHTML = `Page built by <a href="index.html">Siebenlist Solutions</a> ©${currentYear}`;
    }
});

// 3. Simple Interactive Function (Great for demonstrating JS capabilities to your professor)
function welcomeUser() {
    alert("Welcome to Richard Siebenlist Jr's ITIS3135 official course site!");
}