function togglePrograms() {
    const programsList = document.getElementById('programs-list');
    if (programsList.classList.contains('collapsed')) {
        programsList.classList.remove('collapsed');
        programsList.style.maxHeight = programsList.scrollHeight + 'px';
    } else {
        programsList.classList.add('collapsed');
        programsList.style.maxHeight = null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.developer').forEach(developer => {
        developer.addEventListener('mouseover', () => {
            developer.style.transform = 'scale(1.05)';
        });
        developer.addEventListener('mouseout', () => {
            developer.style.transform = 'scale(1)';
        });
    });
});
