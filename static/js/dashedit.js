// JavaScript for the editable team name
function editable(button) {
    const container = button.closest('.clickable-container');
    const displaySpan = container.querySelector('.edit');
    const paragraph = displaySpan.querySelector('textarea');
    const input = container.querySelector('.edit-input1');
    
    input.value = paragraph.textContent; // Set input value to current paragraph text
    displaySpan.style.display = 'none';
    input.style.display = 'inline-block';
    input.focus();
}

function save(element) {
    const displaySpan = element.querySelector('.edit');
    const paragraph = displaySpan.querySelector('textarea');
    const input = element.querySelector('.edit-input1');
    
    if (input.value.trim() !== '') {
        paragraph.textContent = input.value;
    }
    
    displaySpan.style.display = 'inline-block';
    input.style.display = 'none';
}

function handleKeyPress(event, element) {
    if (event.key === 'Enter') {
        saveName(element);

        
    }

    
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function to make the paragraph editable

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
        let inputValue = input.value.slice(0, 20); // Limit the input to 20 characters
        paragraph.textContent = inputValue;
    
        // Apply CSS styles for ellipsis
        paragraph.style.textDecoration = 'underline';
        paragraph.style.marginTop = '0';
        paragraph.style.fontSize = '18px';
        paragraph.style.fontWeight = 'bold';
        paragraph.style.marginBottom = '10px';
        paragraph.style.marginLeft = '15px';
        paragraph.style.width = '100%';
        paragraph.style.overflow = 'hidden';
        paragraph.style.whiteSpace = 'nowrap';
        paragraph.style.textOverflow = 'ellipsis';
        paragraph.style.marginRight = '20px';
        paragraph.style.textAlign = 'center'; // Corrected textAlign property
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
document.querySelectorAll('a .editablename h3').forEach(item => {
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
