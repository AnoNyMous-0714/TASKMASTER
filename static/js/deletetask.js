// Function to delete a task
function deleteTask(taskId) {
    if (window.confirm("Are you sure you want to delete this task?")) {
        // AJAX request to delete the task
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/delete_task/" + taskId, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        
        xhr.onload = function() {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                if (response.success) {
                    // Task deleted successfully, remove from UI
                    var taskElement = document.getElementById("task-container-" + taskId);
                    if (taskElement) {
                        taskElement.parentNode.removeChild(taskElement);
                    } else {
                        alert("Task element not found!");
                    }
                } else {
                    alert("Failed to delete task: " + response.error_message);
                }
            } else {
                alert("Failed to delete task. Please try again later.");
            }
        };

        xhr.onerror = function() {
            alert("Failed to delete task. Please try again later.");
        };

        xhr.send();
    }
}