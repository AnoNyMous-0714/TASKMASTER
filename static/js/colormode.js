// Function to toggle dark mode
function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle("dark-mode");

    // Optionally, you can save the user's preference in localStorage
    const isDarkMode = body.classList.contains("dark-mode");
    localStorage.setItem("darkModeEnabled", JSON.stringify(isDarkMode));
}

// Event listener for dark mode toggle button
document.getElementById("darkModeToggle").addEventListener("click", toggleDarkMode);

// Check if dark mode preference is saved and apply it on page load
document.addEventListener("DOMContentLoaded", () => {
    const isDarkMode = JSON.parse(localStorage.getItem("darkModeEnabled"));
    if (isDarkMode) {
        toggleDarkMode();
    }
});