// Invite Modal //
var inviteModal = document.getElementById("inviteModal");
var inviteBtn = document.getElementById("openInviteModal");
var inviteClose = document.getElementsByClassName("invite-close")[0];

inviteBtn.onclick = function() {
    inviteModal.style.display = "block";
    document.getElementById("bgInviteModal").style.display = "block";
}

inviteClose.onclick = function() {
    inviteModal.style.display = "none";
    document.getElementById("bgInviteModal").style.display = "none";
}

window.onclick = function(event) {
    if (event.target == document.getElementById("bgInviteModal")) {
        inviteModal.style.display = "none";
        document.getElementById("bgInviteModal").style.display = "none";
    }
}

// Create Modal //
var createModal = document.getElementById("createModal");
var createBtn = document.getElementById("openCreateModal");
var createBtn1 = document.getElementById("openCreateModal1");
var createBtn2 = document.getElementById("openCreateModal2");
var createClose = document.getElementsByClassName("create-close")[0];

createBtn.onclick = function(){
    createModal.style.display = "block";
    document.getElementById("bgCreateModal").style.display = "block";
    closeModal(currentModal);
    function closeModal(index) {
        document.getElementById('modal' + index).style.display = "none";
        if (currentModal === index) {
            currentModal = null;
        }
    }
}

createBtn1.onclick = function(){
    createModal.style.display = "block";
    document.getElementById("bgCreateModal").style.display = "block";
    scheduleModal.style.display = "none";
    document.getElementById("bgscheduleModal").style.display = "none";
}

createBtn2.onclick = function(){
    createModal.style.display = "block";
    document.getElementById("bgCreateModal").style.display = "block";
    assignModal.style.display = "none";
    document.getElementById("bgAssignModal").style.display = "none";
}

createClose.onclick = function() {
    createModal.style.display = "none";
    document.getElementById("bgCreateModal").style.display = "none";
}

window.onclick = function(event) {
   if (event.target == document.getElementById("bgCreateModal")) {
        createModal.style.display = "none";
        document.getElementById("bgCreateModal").style.display = "none";
    }
}


// Schedule Modal //
var scheduleModal = document.getElementById("scheduleModal");
var scheduleBtn1 = document.getElementById("openScheduleModal1");
var scheduleBtn2 = document.getElementById("openScheduleModal2");
var scheduleClose = document.getElementsByClassName("schedule-close")[0];
// when the schedule button click this function will open the modal...........................................................................................................................................................................................................................................................................................//
scheduleBtn1.onclick = function() {
    scheduleModal.style.display = "block";
    document.getElementById("bgscheduleModal").style.display = "block";
    // openg schedule modal will make closed the other modal assign modal and create modal when they're open...........................................................................................................................................................................................................................................................................................//
    assignModal.style.display = "none";
    document.getElementById("bgassignModal").style.display = "none";
    createModal.style.display = "none";
    document.getElementById("bgCreateModal").style.display = "none";
}
// another button since only one id must used in each button the openschedulemodal1 is already used in button at create so schedule button 2 is just for another button for navigation process ...........................................................................................................................................................................................................................................................................................//
scheduleBtn2.onclick = function() {
    scheduleModal.style.display = "block";
    document.getElementById("bgscheduleModal").style.display = "block";
    assignModal.style.display = "none";
    document.getElementById("bgassignModal").style.display = "none";
    createModal.style.display = "none";
    document.getElementById("bgCreateModal").style.display = "none";
}
// Close the Schedule Modal...........................................................................................................................................................................................................................................................................................//
scheduleClose.onclick = function() {
    scheduleModal.style.display = "none";
    document.getElementById("bgscheduleModal").style.display = "none";
}

window.onclick = function(event) {
   if (event.target == document.getElementById("bgscheduleModal")) {
        scheduleModal.style.display = "none";
        document.getElementById("bgscheduleModal").style.display = "none";
    }
}

// Assign Modal //
var assignModal = document.getElementById("assignModal");
var assignBtn1 = document.getElementById("openAssignModal1");
var assignBtn2 = document.getElementById("openAssignModal2");
var assignClose = document.getElementsByClassName("assign-close")[0];

assignBtn1.onclick = function() {
    assignModal.style.display = "block";
    document.getElementById("bgassignModal").style.display = "block";
    scheduleModal.style.display = "none";
    document.getElementById("bgscheduleModal").style.display = "none";
    createModal.style.display = "none";
    document.getElementById("bgCreateModal").style.display = "none";
}

assignBtn2.onclick = function() {
    assignModal.style.display = "block";
    document.getElementById("bgassignModal").style.display = "block";
    scheduleModal.style.display = "none";
    document.getElementById("bgscheduleModal").style.display = "none";
    createModal.style.display = "none";
    document.getElementById("bgCreateModal").style.display = "none";
}

assignClose.onclick = function() {
    assignModal.style.display = "none";
    document.getElementById("bgassignModal").style.display = "none";
}

window.onclick = function(event) {
   if (event.target == document.getElementById("bgassignModal")) {
    assignModal.style.display = "none";
        document.getElementById("bgassignModal").style.display = "none";
    }
}

//Select Member//
document.addEventListener('DOMContentLoaded', function() {
    var selectoneModal = document.getElementById("select1Modal");
    var selectoneBtn = document.getElementById("openSelectoneModal");
    var selectoneClose = document.getElementsByClassName("select1-close")[0];
    var usersList = document.getElementById("usersList");

    selectoneBtn.onclick = function() {
        fetch('/get_users')
            .then(response => response.json())
            .then(users => {
                usersList.innerHTML = '';  // Clear existing content

                users.forEach(user => {
                    var userContainer = document.createElement('div');
                    userContainer.className = 'member-container';

                    var userButton = document.createElement('button');
                    userButton.className = 'memberchoose';

                    var userDetails = document.createElement('div');
                    userDetails.className = 'member-details';

                    var userElement = document.createElement('p');
                    userElement.textContent = `${user.first_name} ${user.last_name} (${user.email})`;

                    userDetails.appendChild(userElement);
                    userButton.appendChild(userDetails);
                    userContainer.appendChild(userButton);
                    usersList.appendChild(userContainer);

                    // Add event listener to handle click
                    userButton.addEventListener('click', function() {
                        alert(`Selected member: ${user.first_name} ${user.last_name}`);
                    });
                });
            });
        selectoneModal.style.display = "block";
        document.getElementById("bgselec1Modal").style.display = "block";
    }

    selectoneClose.onclick = function() {
        selectoneModal.style.display = "none";
        document.getElementById("bgselec1Modal").style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == document.getElementById("bgselec1Modal")) {
            selectoneModal.style.display = "none";
            document.getElementById("bgselec1Modal").style.display = "none";
        }
    }
});

// Select Member Two Modal //
var selecttwoModal = document.getElementById("select2Modal");
var selecttwoBtn = document.getElementById("openSelecttwoModal");
var selecttwoClose = document.getElementsByClassName("select2-close")[0];
var membersList = document.getElementById("membersList");  // Get the members list div

selecttwoBtn.onclick = function() {
    fetch('/get_members')
        .then(response => response.json())
        .then(members => {
            membersList.innerHTML = '';  // Clear existing content

            members.forEach(member => {
                var memberContainer = document.createElement('div');
                memberContainer.className = 'member-container';

                var memberButton = document.createElement('button');
                memberButton.className = 'memberchoose';

                var memberDetails = document.createElement('div');
                memberDetails.className = 'member-details';

                var memberElement = document.createElement('p');
                memberElement.textContent = `${member.first_name} ${member.last_name} (${member.email})`;

                memberDetails.appendChild(memberElement);
                memberButton.appendChild(memberDetails);
                memberContainer.appendChild(memberButton);
                membersList.appendChild(memberContainer);

                // Add event listener to handle click
                memberButton.addEventListener('click', function() {
                    alert(`Selected member: ${member.first_name} ${member.last_name}`);
                });
            });
        });
    selecttwoModal.style.display = "block";
    document.getElementById("bgselec2Modal").style.display = "block";
}

selecttwoClose.onclick = function() {
    selecttwoModal.style.display = "none";
    document.getElementById("bgselec2Modal").style.display = "none";
}

window.onclick = function(event) {
   if (event.target == document.getElementById("bgselec2Modal")) {
        selecttwoModal.style.display = "none";
        document.getElementById("bgselec2Modal").style.display = "none";
    }
}

// Invite Member Select Modal
document.addEventListener('DOMContentLoaded', function() {
    var selecttwoModal = document.getElementById("select2Modal");
    var selecttwoBtn = document.getElementById("openSelecttwoModal");
    var selecttwoClose = document.getElementsByClassName("select2-close")[0];
    var membersList = document.getElementById("membersList");  // Get the members list div
    var selectedMembers = document.getElementById("selectedMembers");  // Get the selected members div

    selecttwoBtn.onclick = function() {
        fetch('/get_members')
            .then(response => response.json())
            .then(members => {
                membersList.innerHTML = '';  // Clear existing content

                members.forEach(member => {
                    var userContainer = document.createElement('div');
                    userContainer.className = 'member-container';

                    var userButton = document.createElement('button');
                    userButton.className = 'memberchoose';

                    var userDetails = document.createElement('div');
                    userDetails.className = 'member-details';

                    var userElement = document.createElement('p');
                    userElement.textContent = `${member.first_name} ${member.last_name} (${member.email})`;

                    userDetails.appendChild(userElement);
                    userButton.appendChild(userDetails);
                    userContainer.appendChild(userButton);
                    membersList.appendChild(userContainer);

                    // Add event listener to handle click
                    userButton.addEventListener('click', function() {
                        // Add user to the selected members list
                        var selectedUserContainer = document.createElement('div');
                        selectedUserContainer.className = 'selected-member';

                        var selectedUserDetails = document.createElement('p');
                        selectedUserDetails.textContent = `${member.first_name} ${member.last_name} (${member.email})`;

                        selectedUserContainer.appendChild(selectedUserDetails);
                        selectedMembers.appendChild(selectedUserContainer);
                        
                        // Optionally, add a way to remove the user from the list
                        selectedUserContainer.addEventListener('click', function() {
                            selectedMembers.removeChild(selectedUserContainer);
                        });
                    });
                });
            });
        selecttwoModal.style.display = "block";
        document.getElementById("bgselec2Modal").style.display = "block";
    }

    selecttwoClose.onclick = function() {
        selecttwoModal.style.display = "none";
        document.getElementById("bgselec2Modal").style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == document.getElementById("bgselec2Modal")) {
            selecttwoModal.style.display = "none";
            document.getElementById("bgselec2Modal").style.display = "none";
        }
    }
});
