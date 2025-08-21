function editablename(element) {
    const container = element.closest('.clickable-container');
    const displaySpan = container.querySelector('.editname');
    const paragraph = displaySpan.querySelector('h3');
    const input = container.querySelector('.edit-inputname');

    input.value = paragraph.textContent.trim(); // Set input value to current paragraph text
    displaySpan.style.display = 'none';
    input.style.display = 'inline-block';
    input.focus();

    // Close the dropdown if it's open
    const dropdown = container.querySelector('.dropdown-content-edit');
    if (dropdown) {
        dropdown.style.display = 'none';
    }

    // Prevent the default link behavior
    const link = container.querySelector('a');
    link.onclick = function(event) {
        event.preventDefault();
    };
}

// Function to save the edited name
function savename(element) {
    const container = element.closest('.clickable-container');
    const displaySpan = container.querySelector('.editname');
    const paragraph = displaySpan.querySelector('h3');
    const input = container.querySelector('.edit-inputname');

    if (input.value.trim() !== '') {
        let inputValue = input.value.slice(0, 10); // Limit the input to 10 characters
        paragraph.textContent = inputValue;
    
        // Apply ellipsis if the text exceeds 10 characters
        if (input.value.length > 10) {
            paragraph.classList.add('ellipsis');
        } else {
            paragraph.classList.remove('ellipsis');
        }
    }

    displaySpan.style.display = 'inline-block';
    input.style.display = 'none';

    // Close the dropdown if it's open
    const dropdown = container.querySelector('.dropdown-content-edit');
    if (dropdown) {
        dropdown.style.display = 'none';
    }
}

// Function to handle keypress event
function handleKeyPress(event, element) {
    if (event.key === 'Enter') {
        savename(element);
    }
}

// Prevent navigation on double-click
document.querySelectorAll('.editname h3').forEach(item => {
    item.addEventListener('dblclick', function(event) {
        event.preventDefault(); // Prevent default link behavior on double-click
        editablename(item);
    });
});

// Function to toggle dropdown visibility
function toggleDropdown(event) {
    event.preventDefault(); // Prevent default anchor behavior
    var dropdown = event.currentTarget.nextElementSibling; // Get dropdown-content-edit element

    // Toggle display of dropdown menu
    dropdown.style.display = (dropdown.style.display === 'block') ? 'none' : 'block';
}

// Close the dropdown menu if the user clicks outside of it
document.addEventListener('click', function(event) {
    if (!event.target.closest('.dropdown')) {
        var dropdowns = document.getElementsByClassName('dropdown-content-edit');
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            openDropdown.style.display = 'none';
        }
    }
});