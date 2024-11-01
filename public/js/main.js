
if (localStorage.getItem("isSmall") === "yes") {
  sidebarId.classList.add("small-sidebar");
} else {
  sidebarId.classList.remove("small-sidebar");
}

const toggleSidebar = () => {
  if (localStorage.getItem("isSmall") === "yes") {
    localStorage.setItem("isSmall", "no");
    sidebarId.classList.remove("small-sidebar");
  } else {
    localStorage.setItem("isSmall", "yes");
    sidebarId.classList.add("small-sidebar");
  }
};


function toggleTextarea(checkbox) {
  const textareaId = checkbox.getAttribute('data-target');
  const textarea = document.getElementById(textareaId);
  textarea.style.display = checkbox.checked ? 'block' : 'none';
}

const roomContainer = document.getElementById('roomContainer');
const addRoomBtn = document.getElementById('addRoomBtn');

let roomCount = 1; // Start from room #1

// Add new room form
addRoomBtn.addEventListener('click', () => {
  roomCount++;

  const roomForm = document.createElement('div');
  roomForm.classList.add('room-item', 'border', 'p-3', 'mb-3', 'rounded', 'position-relative');
  roomForm.innerHTML = `
    <h4>Room #${roomCount}</h4>
    <div class="mb-3">
      <label for="type" class="form-label">Room Type</label>
      <select class="form-select" name="typee[]" required>
        <option value="Single">Single</option>
        <option value="Double">Double</option>
        <option value="Suite">Suite</option>
      </select>
    </div>

    <div class="mb-3">
      <label for="description" class="form-label">Description</label>
      <textarea class="form-control" name="description[]" rows="2" required></textarea>
    </div>

    <!-- Remove Room Button -->
    <button type="button" class="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 remove-room-btn">Remove</button>
  `;

  roomContainer.appendChild(roomForm);

  // Add event listener to the new "Remove" button
  roomForm.querySelector('.remove-room-btn').addEventListener('click', () => {
    roomForm.remove();
  });
});

// Event listener for the initial "Remove" button
document.querySelectorAll('.remove-room-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.target.closest('.room-item').remove();
  });
});

// Add new input dynamically


// descriptions houses
document.getElementById('addDescriptionBtn').addEventListener('click', function() {
    const descriptionsContainer = document.getElementById('descriptionsContainer');

    // Create a new description div
    const newDescriptionDiv = document.createElement('div');
    newDescriptionDiv.className = 'form-group';

    const newDescriptionTextarea = document.createElement('textarea');
    newDescriptionTextarea.className = 'form-control my-2';
    newDescriptionTextarea.name = 'descriptions[]';
    newDescriptionTextarea.rows = 2;
    newDescriptionTextarea.placeholder = 'Add another description';
    newDescriptionDiv.appendChild(newDescriptionTextarea);

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'btn btn-danger mt-2 removeDescriptionBtn';
    removeButton.innerText = 'X';
    newDescriptionDiv.appendChild(removeButton);

    descriptionsContainer.appendChild(newDescriptionDiv);

    // Show the remove button for the first description
    const firstRemoveBtn = document.querySelector('.removeDescriptionBtn');
    if (firstRemoveBtn) {
        firstRemoveBtn.style.display = 'inline-block';
    }

    // Add event listener for the remove button
    removeButton.addEventListener('click', function() {
        descriptionsContainer.removeChild(newDescriptionDiv);
        // Hide the remove button if there are no descriptions left
        if (descriptionsContainer.children.length === 1) {
            firstRemoveBtn.style.display = 'none';
        }
    });
});



