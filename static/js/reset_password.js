function checkPasswordStrength() {
    const password = document.getElementById('password').value;
    const strengthMeter = document.getElementById('strength-meter');

    const weakRegex = /.{6,}/;
    const mediumRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/;
    const strongRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{10,}/;

    if (strongRegex.test(password)) {
        strengthMeter.className = 'strength-meter strong';
    } else if (mediumRegex.test(password)) {
        strengthMeter.className = 'strength-meter medium';
    } else if (weakRegex.test(password)) {
        strengthMeter.className = 'strength-meter weak';
    } else {
        strengthMeter.className = 'strength-meter';
    }
}


