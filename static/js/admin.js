document.addEventListener('DOMContentLoaded', () => {
    // Event listeners for navigation buttons
    document.getElementById('userManagementBtn').onclick = () => location.href = 'user-management.html';
    document.getElementById('addNewUserBtn').onclick = () => location.href = 'add-new-user.html';
    document.getElementById('editExistingUserBtn').onclick = () => location.href = 'edit-existing-user.html';
    document.getElementById('roleManagementBtn').onclick = () => location.href = 'role-management.html';
    document.getElementById('userRegistrationApprovalBtn').onclick = () => location.href = 'user-registration-approval.html';
    document.getElementById('dataManagementBtn').onclick = () => location.href = 'data-management.html';

    // Fetch users and render in table
    const userTableBody = document.getElementById('userTableBody');
    fetch('/get_users')
        .then(response => response.json())
        .then(users => {
            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.user_id}</td>
                    <td>${user.first_name} ${user.last_name}</td>
                    <td>${user.email}</td>
                `;
                userTableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching users:', error));

    // Add event listeners for archive buttons
    document.querySelectorAll('.archive-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            if (!confirm('Are you sure you want to archive this user?')) {
                event.preventDefault();
            }
        });
    });

    // Add event listeners for restore and delete buttons
    document.querySelectorAll('.restore-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            if (!confirm('Are you sure you want to restore this user?')) {
                event.preventDefault();
            }
        });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            if (!confirm('Are you sure you want to permanently delete this user?')) {
                event.preventDefault();
            }
        });
    });

    // Add event listener for logout button
    document.getElementById('logoutBtn').addEventListener('click', (event) => {
        if (!confirm('Are you sure you want to log out?')) {
            event.preventDefault();
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    var logoutBtn = document.getElementById('logoutBtn');
    var modal = document.getElementById('logoutModal');
    var span = document.getElementsByClassName('close')[0];
    var confirmLogoutBtn = document.getElementById('confirmLogoutBtn');
    var cancelLogoutBtn = document.getElementById('cancelLogoutBtn');

    logoutBtn.onclick = function() {
        modal.style.display = 'block';
    }

    span.onclick = function() {
        modal.style.display = 'none';
    }

    cancelLogoutBtn.onclick = function() {
        modal.style.display = 'none';
    }

    confirmLogoutBtn.onclick = function() {
        document.getElementById('logoutForm').submit();
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
});

function showModal(button) {
    const userId = button.getAttribute('data-user-id');
    const modal = document.getElementById('confirmationModal');
    modal.style.display = 'block';

    document.getElementById('confirmBtn').onclick = function() {
        document.getElementById('archiveForm' + userId).submit();
    };

    document.getElementById('cancelBtn').onclick = function() {
        modal.style.display = 'none';
    };
}

// Close modal if the user clicks outside of it
window.onclick = function(event) {
    const modal = document.getElementById('confirmationModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};


function confirmDelete(actionUrl) {
    var deleteForm = document.getElementById("deleteForm");
    deleteForm.action = actionUrl;
    var deleteModal = document.getElementById("deleteModal");
    deleteModal.style.display = "block";
}

function closeDeleteModal() {
    var deleteModal = document.getElementById("deleteModal");
    deleteModal.style.display = "none";
}

window.onclick = function(event) {
    var deleteModal = document.getElementById("deleteModal");
    if (event.target == deleteModal) {
        deleteModal.style.display = "none";
    }
}

// Maintenance

function backupSystem() {
    fetch('/backup')  // Send a GET request to '/backup' endpoint
      .then(response => response.blob())  // Convert response to Blob
      .then(blob => {
           const url = window.URL.createObjectURL(blob);  // Create a URL for the Blob
           const a = document.createElement('a');  // Create a <a> element
           a.href = url;  // Set the href attribute of the <a> element to the Blob URL
           a.download = 'taskmaster.sql';  // Set the download attribute to specify the filename
           a.click();  // Programmatically click the <a> element to trigger download
       });
}

function confirmRestore() {
    document.getElementById("myModal").style.display = "block";
}

function closeModal() {
    document.getElementById("myModal").style.display = "none";
}

function restoreSystem() {
    const filepath = document.getElementById('filepath').value;
    fetch('/restore', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filepath: filepath })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        // Optionally handle success or failure here
    })
    .catch(error => {
        console.error('Error:', error);
    });
    Swal.fire({
        icon: 'success',
        title: 'Database Restored Successfully!',
        showConfirmButton: false,
        timer: 1500
    });

    // Close the modal after restoration
    closeModal();
}

function restoreSystem() {
    document.getElementById('restoreForm').submit();
}

