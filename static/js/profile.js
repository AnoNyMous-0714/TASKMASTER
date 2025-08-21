function editProfile() {
    // Fetch user profile data
    fetch('/get_profile_data')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('first-name-input').value = data.first_name || '';
                document.getElementById('last-name-input').value = data.last_name || '';
                document.getElementById('username-input').value = data.username || '';
                document.getElementById('birth-date-input').value = data.birth_date || '';
                document.getElementById('email-input').value = data.email || '';
                document.getElementById('bio-input').value = data.bio || '';
            }

            document.getElementById('username').style.display = 'none';
            document.getElementById('email').style.display = 'none';
            document.getElementById('bio').style.display = 'none';
            document.querySelector('.edit-button').style.display = 'none';
            document.querySelector('.edit-picture-button').style.display = 'inline-block';
            document.getElementById('edit-form').style.display = 'block';
        });
}

function cancelEdit() {
    document.getElementById('username').style.display = 'block';
    document.getElementById('email').style.display = 'block';
    document.getElementById('bio').style.display = 'block';
    document.querySelector('.edit-button').style.display = 'block';
    document.querySelector('.edit-picture-button').style.display = 'none';
    document.getElementById('edit-form').style.display = 'none';
}

function saveProfile() {
    var formData = new FormData(document.getElementById('profile-edit-form'));
    var newEmail = formData.get('email');

    fetch('/save_profile', {
        method: 'POST',
        body: formData
    }).then(response => {
        if (response.ok) {
            response.json().then(data => {
                if (data.success) {
                    if (formData.get('first_name')) document.getElementById('username').innerText = formData.get('first_name') + ' ' + (formData.get('last_name') || "{{ last_name }}");
                    if (formData.get('last_name')) document.getElementById('username').innerText = (formData.get('first_name') || "{{ first_name }}") + ' ' + formData.get('last_name');
                    if (formData.get('email')) document.getElementById('email').innerText = 'Email: ' + formData.get('email');
                    if (formData.get('bio')) document.getElementById('bio').innerText = formData.get('bio');
                    if (formData.get('profile-picture')) {
                        var reader = new FileReader();
                        reader.onload = function() {
                            var dataURL = reader.result;
                            document.getElementById('profile-image').src = dataURL;
                            document.getElementById('sidebar-profile-image').src = dataURL;
                        };
                        reader.readAsDataURL(formData.get('profile-picture'));
                    }
                    cancelEdit();
                }
            });
        } else {
            alert('Failed to save profile.');
        }
    });

    if (formData.get('email') !== formData.get('new_email')) {
        // Request email change confirmation
        // Send email change request
    fetch('/request_email_change', {
        method: 'POST',
        body: JSON.stringify({ new_email: newEmail }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
      .then(data => {
          if (data.success) {
              alert(data.message);
          } else {
              alert('Failed to request email change.');
          }
      });
    } else {
        // Save profile without email change
        fetch('/save_profile', {
            method: 'POST',
            body: formData
        }).then(response => {
            if (response.ok) {
                response.json().then(data => {
                    if (data.success) {
                        updateProfileUI(formData);
                        cancelEdit();
                    }
                });
            } else {
                alert('Failed to save profile.');
            }
        });
    }
}

function previewProfilePicture(event) {
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function() {
        var dataURL = reader.result;
        document.getElementById('profile-image').src = dataURL;
        document.getElementById('sidebar-profile-image').src = dataURL;
    };
    reader.readAsDataURL(input.files[0]);
}

document.getElementById('profile-picture-input').addEventListener('change', function(event) {
    var formData = new FormData();
    formData.append('profile-picture', event.target.files[0]);

    fetch('/upload_profile_picture', {
        method: 'POST',
        body: formData
    }).then(response => response.json())
      .then(data => {
          if (data.success) {
              document.getElementById('profile-image').src = data.profile_picture_url;
              document.getElementById('sidebar-profile-image').src = data.profile_picture_url;
          } else {
              alert('Failed to upload profile picture.');
          }
      });
});
















