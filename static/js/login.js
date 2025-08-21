function togglePasswordVisibility() {
    var passwordInput = document.getElementById('password');
    var eyeIcon = document.getElementById('eye-icon');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.classList.remove('bi-eye-slash');
        eyeIcon.classList.add('bi-eye');
    } else {
        passwordInput.type = 'password';
        eyeIcon.classList.add('bi-eye-slash');
        eyeIcon.classList.remove('bi-eye');
    }
}

window.onload = function() {
    var flashMessages = document.getElementById('flash-messages');
    if (flashMessages) {
        var messages = flashMessages.getElementsByTagName('p');
        if (messages.length > 0) {
            alert(messages[0].innerText);  // Display the first flash message as an alert
        }
    }
};

    




     