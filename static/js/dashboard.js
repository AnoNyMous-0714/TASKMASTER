document.addEventListener('DOMContentLoaded', function() {
  const containerWrapper = document.getElementById('containerWrapper');
  const createContainerButton = document.getElementById('createContainerButton');
  const containerTemplate = document.getElementById('containerTemplate').content;

  let containerCounter = 1;
  const maxContainers = 8;

  createContainerButton.addEventListener('click', function() {
    if (containerCounter <= maxContainers) {
      const newContainer = document.importNode(containerTemplate, true);

      newContainer.querySelector('h3').textContent = `Workspace ${containerCounter}`;
      newContainer.querySelector('textarea').textContent = `This is the content of Container ${containerCounter}`;

      containerCounter++;
      containerWrapper.appendChild(newContainer);

      if (containerCounter > maxContainers) {
        createContainerButton.disabled = true;
        console.log("Maximum containers reached");
        alert("Maximum containers reached");
      }
    }
  });

  const priorityDropdown = document.getElementById('priority');
  priorityDropdown.addEventListener('change', function() {
    const selectedPriority = priorityDropdown.value;
    console.log('Selected Priority:', selectedPriority);
  });
});

