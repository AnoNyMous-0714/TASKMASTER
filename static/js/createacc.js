var pwd = document.getElementById("password");
pwd.addEventListener("input", function() {
  if (this.validity.valid) {
    this.style.border = "2px solid green";
  }

  else {
    
    this.style.border = "solid red 2px"
    }
  
});

var pwd1 = document.getElementById('passwordagain');
pwd1.addEventListener("input", function() {
var passwordValue1 = document.getElementById('password').value;
    if (this.value == passwordValue1) {
        this.style.border = "2px solid green";
    } else {
        this.style.border = "2px solid red";
    }
});

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

  function clicked() {
            var FnameValue = document.getElementById('fname').value;
            var LnameValue = document.getElementById('Lname').value;
            var userValue = document.getElementById('username').value;
            var passwordValue1 = document.getElementById('password').value;
            var birthValue = document.getElementById('birth').value;
            var passagainValue = document.getElementById('passwordagain').value;
            var homepageurl = ("homepage");
            if (FnameValue === "" && LnameValue ==="" && userValue === "" && passwordValue1 === "" && birthValue === "" && passagainValue === "") {
            }
            else if(passwordValue1 !== passagainValue){
              alert("Password are not the same");
            }

            else {
                // Redirect to Website.html if all fields are filled
                window.location = homepageurl;
              
            }

}

var passwordValue1 = document.getElementById('password');
var letter = document.getElementById("letter");
var capital = document.getElementById("capital");
var number = document.getElementById("number");
var length = document.getElementById("length");
var strong = document.getElementById("strongpass");

passwordValue1.onfocus = function() {
  document.getElementById("message").style.display = "block";
}

// When the user clicks outside of the password field, hide the message box
passwordValue1.onblur = function() {
  document.getElementById("message").style.display = "none";
}

// When the user starts to type something inside the password field
passwordValue1.onkeyup = function() {
  // Validate lowercase letters
  var lowerCaseLetters = /[a-z]/g;
  if(passwordValue1.value.match(lowerCaseLetters)) {
    letter.classList.remove("invalid");
    letter.classList.add("valid");
  } else {
    letter.classList.remove("valid");
    letter.classList.add("invalid");
  }

  // Validate capital letters
  var upperCaseLetters = /[A-Z]/g;
  if(passwordValue1.value.match(upperCaseLetters)) {
    capital.classList.remove("invalid");
    capital.classList.add("valid");
  } else {
    capital.classList.remove("valid");
    capital.classList.add("invalid");
  }

  // Validate numbers
  var numbers = /[0-9]/g;
  if(passwordValue1.value.match(numbers)) {
    number.classList.remove("invalid");
    number.classList.add("valid");
  } else {
    number.classList.remove("valid");
    number.classList.add("invalid");
  }

  // Validate length
  if(passwordValue1.value.length >= 8) {
    length.classList.remove("invalid");
    length.classList.add("valid");
  } else {
    length.classList.remove("valid");
    length.classList.add("invalid");
  }

  // Check if all conditions are met
  if (letter.classList.contains("valid") && capital.classList.contains("valid") && number.classList.contains("valid") && length.classList.contains("valid")) {
    strong.classList.remove("invalid");
    strong.classList.add("valid");
  } 
  else {
    strong.classList.remove("valid");
    strong.classList.add("invalid");
  }
}

function showModal() {
      document.getElementById('tosModal').style.display = 'block';
    }

    function closeModal() {
      document.getElementById('tosModal').style.display = 'none';
    }

    window.onclick = function(event) {
      var modal = document.getElementById('tosModal');
      if (event.target == modal) {
        modal.style.display = 'none';
      }
    }

    window.onclick = function(event) {
      if (event.target == document.getElementById("tosModal")) {
        closeModal();
      }
    }

    function validateForm() {
      var tosCheckbox = document.getElementById("tos");
      if (!tosCheckbox.checked) {
        alert("Please agree to the Terms of Service before proceeding.");
        return false;
      }
      return true;
    }