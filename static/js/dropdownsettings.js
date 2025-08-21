
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}


function myPriorityDone() {
    document.getElementById("myPriority").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.prioritybtn')) {
        var dropdowns = document.getElementsByClassName("priority-contentDone");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}



function myPriorityDo(index) {
    var dropdownContent = document.getElementById("myPriorityToDo" + index);
    dropdownContent.classList.toggle("show");

    // Close other dropdowns except the current one
    var dropdowns = document.querySelectorAll('.priority-contentDo');
    dropdowns.forEach(function(dropdown) {
        if (dropdown.id !== "myPriorityToDo" + index) {
            dropdown.classList.remove('show');
        }
    });
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.prioritybtnDo')) {
        var dropdowns = document.getElementsByClassName("priority-contentDo");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}



