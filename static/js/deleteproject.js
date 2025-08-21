function deleteProject(projectId) {
    if (confirm("Are you sure you want to delete this project and all associated tasks?")) {
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
}
