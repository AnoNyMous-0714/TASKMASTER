 // JavaScript for the editable team name
 function makeEditable(element) {
  const displaySpan = element.querySelector('.display');
  const input = element.querySelector('.edit-input');
  displaySpan.style.display = 'none';
  input.style.display = 'inline-block';
  input.focus();
}

function saveName(element) {
  const displaySpan = element.querySelector('.display');
  const input = element.querySelector('.edit-input');
  if (input.value.trim() !== '') {
      displaySpan.textContent = input.value;
  }
  displaySpan.style.display = 'inline-block';
  input.style.display = 'none';
}

function handleKeyPress(event, element) {
  if (event.key === 'Enter') {
      saveName(element);
  }
}

