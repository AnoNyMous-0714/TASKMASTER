document.getElementById("inviteButton").addEventListener("click", function () {
    const projectId = document.getElementById("project_id").value;
    const invitedUserEmail = document.getElementById("invited_user_email").value;
    const role = document.getElementById("manualRole").value;
    const message = document.getElementById("message").value;
  
    if (!projectId || !invitedUserEmail || !role || !message) {
        alert("Please fill out all fields.");
        return;
    }
  
    const formData = new FormData();
    formData.append("project_id", projectId);
    formData.append("invited_user_email", invitedUserEmail);
    formData.append("role", role);
    formData.append("message", message);
  
    const inviteButton = document.getElementById("inviteButton");
    inviteButton.disabled = true;
    inviteButton.textContent = "Inviting...";
  
    fetch("/send_invitation", {
        method: "POST",
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showSuccessPopup("Invitation sent successfully!");
            document.getElementById("inviteForm").reset();
            updateInvitedMembersList(projectId);
        } else {
            alert("Failed to send invitation: " + data.message);
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("An error occurred while sending the invitation.");
    })
    .finally(() => {
        inviteButton.disabled = false;
        inviteButton.textContent = "Invite";
    });
  });
  

function showSuccessPopup(message) {
  const popup = document.createElement("div");
  popup.className = "success-popup";
  popup.textContent = message;
  document.body.appendChild(popup);

  setTimeout(() => {
      popup.remove();
  }, 3000);
}

function updateInvitedMembersList(projectId) {
    fetch(`/get_invited_members/${projectId}`)
    .then(response => response.json())
    .then(data => {
        const invitedMembersList = document.querySelector(".invited-members ul");
        invitedMembersList.innerHTML = "";
  
        data.invited_members.forEach(member => {
            const listItem = document.createElement("li");
            listItem.textContent = `${member.first_name} ${member.last_name} (Username: ${member.username}) - Role: ${member.role}`;
            invitedMembersList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error("Error fetching invited members:", error);
    });
  }
  
