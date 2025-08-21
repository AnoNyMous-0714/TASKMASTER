// JavaScript for Dash Modal
var inviteModal = document.getElementById("dashModal");
var inviteBtn = document.getElementById("openDashModal");
var inviteClose = document.getElementsByClassName("dash-close")[0];

inviteBtn.onclick = function() {
    inviteModal.style.display = "block";
    document.getElementById("bgdashModal").style.display = "block";
}

inviteClose.onclick = function() {
    inviteModal.style.display = "none";
    document.getElementById("bgdashModal").style.display = "none";
    resetModal();
}

window.onclick = function(event) {
    if (event.target == document.getElementById("bgdashModal")) {
        inviteModal.style.display = "none";
        document.getElementById("bgdashModal").style.display = "none";
        resetModal();
    }
}

function validateDeadline() {
    var deadline = document.getElementById("deadline").value;
    var deadlineTime = document.getElementById("deadline_time").value;
    var deadlineDateTime = new Date(deadline + "T" + deadlineTime);
    var now = new Date();

    if (deadlineDateTime <= now) {
        alert("Deadline must be a future date and time.");
        return false;
    }
    return true;
}

function resetModal() {
    document.getElementById("project_name").value = "";
    document.getElementById("deadline").value = "";
    document.getElementById("deadline_time").value = "";
    document.getElementById("priority").value = "Medium";
}

document.addEventListener('DOMContentLoaded', function() {
    const projectDetails = document.getElementById('projectDetails');
    const projects = projectDetails.querySelectorAll('.project');

    projects.forEach(project => {
        project.addEventListener('click', function() {
            const title = project.querySelector('h3').textContent;
            const desc = project.querySelector('p').textContent;
            const deadline = project.querySelector('p:nth-child(3)').textContent.split(' ')[1];
            const deadlineTime = project.querySelector('p:nth-child(3)').textContent.split(' ')[2];

            document.getElementById('project_name').value = title;
            document.getElementById('deadline').value = deadline;
            document.getElementById('deadline_time').value = deadlineTime;

            inviteModal.style.display = "block";
            document.getElementById("bgdashModal").style.display = "block";
        });
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const editModal = document.getElementById('editModal');
    const editModalBg = document.getElementById('bgeditModal');
    const saveEditButton = document.getElementById('saveEditButton');
    const editModalClose = document.getElementById('editModalClose');

    // Function to open edit modal
    window.openEditModal = function(project_id, project_name, deadline, deadline_time, priority) {
        editModal.style.display = 'block';
        editModalBg.style.display = 'block';

        // Fill in modal fields with current project details
        document.getElementById('edit_project_id').value = project_id;
        document.getElementById('edit_project_name').value = project_name;
        document.getElementById('edit_deadline').value = deadline;
        document.getElementById('edit_deadline_time').value = deadline_time;
        document.getElementById('edit_priority').value = priority;
    };

    // Function to close edit modal
    function closeEditModal() {
        editModal.style.display = 'none';
        editModalBg.style.display = 'none';
    }

    // Close button click event
    editModalClose.onclick = function() {
        closeEditModal();
    };

    // Save button click event
    saveEditButton.addEventListener('click', () => {
        const formData = new FormData(document.getElementById('editProjectForm'));

        fetch('/edit_project', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Success:', data.message);
                // Update the UI with the new project details
                const projectContainer = document.querySelector(`[data-project-id="${data.project_id}"]`);
                projectContainer.querySelector('h3').textContent = data.project_name;
                projectContainer.querySelector('.project-details').innerHTML = `
                    <p><strong>Deadline:</strong> ${data.deadline}</p>
                    <p><strong>Time:</strong> ${data.deadline_time}</p>
                    <p><strong>Priority:</strong> ${data.priority}</p>
                `;
                closeEditModal();
                showNotification('Project details saved successfully!');
            } else {
                console.error('Error:', data.message);
                showNotification('Error saving project details. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Error saving project details. Please try again.');
        });
    });

    // Function to show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.classList.add('popup');
        notification.textContent = message;
        document.body.appendChild(notification);

        // Remove the notification after 3 seconds (adjust timing as needed)
        setTimeout(() => {
            notification.remove();
        }, 3000);
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
});

// Function to handle keypress event
function handleKeyPress(event, element) {
    if (event.key === 'Enter') {
        savename(element);
    }
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


//For delete button//
function deleteProject(projectId) {
    fetch(`/delete_project/${projectId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': '{{ csrf_token() }}'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            window.location.reload(); // Reload the page after deletion
        } else {
            alert('Failed to delete project: ' + data.error_message);
        }
    })
    .catch(error => {
        console.error('Error deleting project:', error);
        alert('Failed to delete project. Please try again later.');
    });
}