document.addEventListener('DOMContentLoaded', function () {
  const addItemButtons = document.querySelectorAll('.add-item-btn');

  addItemButtons.forEach(button => {
    button.addEventListener('click', function () {
      const listId = this.getAttribute('data-list-id'); // Get the target list ID
      const list = document.getElementById(listId); // Find the corresponding <ul> element

      // Create a new list item with input fields
      const newItem = document.createElement('li');
      newItem.classList.add('list-group-item', 'd-flex', 'align-items-center');

      // Get the section name from the hidden input in the same section
      const sectionName = this.parentElement.querySelector('.nameInput')?.value || ''; // Find the value of the hidden input

      newItem.innerHTML = `
          <input type="text" class="form-control me-2" name="${sectionName}Title[]" placeholder="Title" />
          <input type="number" class="form-control me-2" name="${sectionName}Distance[]" placeholder="Distance (km)" min="0" step="0.1" />
          <button type="button" class="btn btn-danger btn-sm remove-item-btn">Remove</button>
        `;

      // Append the new item to the list
      list.appendChild(newItem);

      // Add event listener for the 'Remove' button in the new item
      newItem.querySelector('.remove-item-btn').addEventListener('click', function () {
        newItem.remove(); // Remove the item when the 'Remove' button is clicked
      });
    });
  });

  // Initial 'Remove' button event listeners
  document.querySelectorAll('.remove-item-btn').forEach(button => {
    button.addEventListener('click', function () {
      this.parentElement.remove(); // Remove the item
    });
  });
});


//  add js about button show and hide item (envrement and conditions and description) 
function showHide() {
  const idDiv = document.getElementById("Enverment");
  const btn = document.getElementById("btnShowHide");

  // Toggle display and button text based on current state
  if (idDiv.style.display === "none" || idDiv.style.display === "") {
    idDiv.style.display = "block";
    btn.innerHTML = "Hide Enverment";
  } else {
    idDiv.style.display = "none";
    btn.innerHTML = "Show Enverment";
  }
}

//  function age
function toggleInput() {
  const select = document.getElementById("yesNoSelect");
  const input = document.getElementById("ageRestrictionInput");

  if (select.value === "yes") {
      input.removeAttribute("readonly");
      input.focus();  
  } else {
      input.setAttribute("readonly", true);
      input.value = ""; 
  }
}

//  function beds
function toggleBebeBedsInput() {
  const select = document.getElementById("bebebeds");
  const input = document.getElementById("bedsRestrictionInput");

  if (select.value === "yes") {
      input.removeAttribute("readonly");
      input.focus();  
  } else {
      input.setAttribute("readonly", true);
      input.value = "";  
  }
}





