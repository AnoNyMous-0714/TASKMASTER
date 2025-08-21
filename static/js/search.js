document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('searchInput');
  const autocompleteResults = document.getElementById('autocompleteResults');

  var items = [
      { title: "About PSBA", url: "/about" },
      { title: "About the Software", url: "/about" },
      { title: "Contact", url: "/about" },
      { title: "How do I create a new account?", url: "/help" },
      { title: "How do I log in to my account?", url: "/help" },
      { title: "Account Settings", url: "/help" },
      { title: "How do I change my email address?", url: "/help" },
      { title: "How do I update my profile information?", url: "/help" },
      { title: "Privacy", url: "/help" },
      { title: "Security", url: "/help" },
      { title: "Support", url: "/help" }
  ];

  searchInput.addEventListener('input', function() {
      const inputValue = this.value.toLowerCase();
      let autocompleteHTML = '';

      items.forEach(item => {
          if (item.title.toLowerCase().includes(inputValue)) {
              autocompleteHTML += `<div class="autocomplete-item" data-url="${item.url}">${item.title}</div>`;
          }
      });

      autocompleteResults.innerHTML = autocompleteHTML;
      autocompleteResults.classList.add('active');
  });

  document.addEventListener('click', function(e) {
      if (!autocompleteResults.contains(e.target) && e.target !== searchInput) {
          autocompleteResults.classList.remove('active');
      }
  });

  autocompleteResults.addEventListener('click', function(e) {
      if (e.target.classList.contains('autocomplete-item')) {
          searchInput.value = e.target.innerText;
          const url = e.target.getAttribute('data-url');
          autocompleteResults.classList.remove('active');
          // Redirect to the selected URL
          if (url) {
              window.location.href = url;
          }
      }
  });
});
