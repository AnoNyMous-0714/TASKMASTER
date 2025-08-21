document.addEventListener("DOMContentLoaded", function() {
    fetch("/get_profile_data")
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const truncatedUsername = truncateText(data.username, 11);
                document.querySelector(".editable .display").textContent = truncatedUsername;
                document.querySelector(".editable .edit-input").value = data.username;
            } else {
                alert("Failed to load profile data.");
            }
        });
});

function makeEditable(element) {
    element.classList.add("editing");
    const input = element.querySelector(".edit-input");
    input.value = element.querySelector(".display").textContent;
    input.focus();
}

function saveName(element) {
    element.classList.remove("editing");
    const input = element.querySelector(".edit-input");
    const newName = input.value;
    const truncatedUsername = truncateText(newName, 11);
    element.querySelector(".display").textContent = truncatedUsername;

    fetch("/save_profile", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `username=${newName}`
    })
    .then(response => response.json())
    .then(data => {
        if (!data.success) {
            alert("Failed to save profile.");
        }
    });
}

function handleKeyPress(event, element) {
    if (event.key === "Enter") {
        saveName(element);
    }
}

function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength - 3) + "...";
    }
    return text;
}