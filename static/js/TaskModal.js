let currentModal = null;

    function openModal(index) {
      if (currentModal !== null) {
        closeModal(currentModal);
      }
      currentModal = index;
      document.getElementById('modal' + index).style.display = "block";
      document.getElementById('parent-container').classList.add('parent-container-bg');
    }

    function closeModal(index) {
      document.getElementById('modal' + index).style.display = "none";
      if (currentModal === index) {
        currentModal = null;
      }
      document.getElementById('parent-container').classList.remove('parent-container-bg');
    }
