// Get all the container elements
const containers1 = document.querySelectorAll('.container_task1');
const containers2 = document.querySelectorAll('.container_task2');
const containers3 = document.querySelectorAll('.container_task3');

// Define an array of colors
const colors_one = ['#949398', '#F4DF4E', '#5B84B1', '#FC766A', '#5F4B8B', '#E69A8D', '#CDB599', '#ADEFD1', '#00203F', '#606060', '#000000', '#97BC62'];
const colors_two = ['#949398', '#F4DF4E', '#5B84B1', '#FC766A', '#5F4B8B', '#E69A8D', '#CDB599', '#ADEFD1', '#00203F', '#606060', '#000000', '#97BC62'];
const colors_three = ['#949398', '#F4DF4E', '#5B84B1', '#FC766A', '#5F4B8B', '#E69A8D', '#CDB599', '#ADEFD1', '#00203F', '#606060', '#000000', '#97BC62'];



// Keep track of the clicked colors
const clickedColors1 = new Set();
const clickedColors2 = new Set();
const clickedColors3 = new Set();


// Loop through each container for task1
containers1.forEach((container, index) => {
    // Add a click event listener to the container
    container.addEventListener('click', function(event) {
        // Check if the target is within the table row
        if (event.target.closest('tr')) {
            // Generate a new border color
            const newBorderColor = colors_one[Math.floor(Math.random() * colors_one.length)];

            // Update the border color of the clicked container
            this.style.border = `2px solid ${newBorderColor}`;

            // Add the new border color to the set of clicked colors
            clickedColors1.add(newBorderColor);

            // Check if all colors have been clicked
            if (clickedColors1.size === colors_one.length) {
                // Set the border of all containers to a default style (with no color)
                containers1.forEach(container => {
                    container.style.border = '1px solid #ccc'; // Change this to your desired default border style
                });
                // Clear the clicked colors set
                clickedColors1.clear();
            }
        }
    });
});

// Loop through each container for task2
containers2.forEach((container, index) => {
    // Add a click event listener to the container
    container.addEventListener('click', function(event) {
        // Check if the target is within the table row
        if (event.target.closest('tr')) {
            // Generate a new border color
            const newBorderColor = colors_two[Math.floor(Math.random() * colors_two.length)];

            // Update the border color of the clicked container
            this.style.border = `2px solid ${newBorderColor}`;

            // Add the new border color to the set of clicked colors
            clickedColors2.add(newBorderColor);

            // Check if all colors have been clicked
            if (clickedColors2.size === colors_two.length) {
                // Set the border of all containers to a default style (with no color)
                containers2.forEach(container => {
                    container.style.border = '1px solid #ccc'; // Change this to your desired default border style
                });
                // Clear the clicked colors set
                clickedColors2.clear();
            }
        }
    });
});

containers3.forEach((container, index) => {
    // Add a click event listener to the container
    container.addEventListener('click', function(event) {
        // Check if the target is within the table row
        if (event.target.closest('tr')) {
            // Generate a new border color
            const newBorderColor = colors_three[Math.floor(Math.random() * colors_three.length)];

            // Update the border color of the clicked container
            this.style.border = `2px solid ${newBorderColor}`;

            // Add the new border color to the set of clicked colors
            clickedColors3.add(newBorderColor);

            // Check if all colors have been clicked
            if (clickedColors3.size === colors_three.length) {
                // Set the border of all containers to a default style (with no color)
                containers3.forEach(container => {
                    container.style.border = '1px solid #ccc'; // Change this to your desired default border style
                });
                // Clear the clicked colors set
                clickedColors3.clear();
            }
        }
    });
});
