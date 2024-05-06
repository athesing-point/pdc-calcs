document.addEventListener("DOMContentLoaded", function () {
  const exitModal = document.querySelector(".modal-exitpopup");
  const closeButton = document.querySelector(".close");
  const background = document.querySelector(".modal-bg-layer");
  const section = document.querySelector(".section-exit-popup");

  if (!exitModal || !closeButton || !background || !section) {
    console.error("One or more elements are missing!");
    return; // Stop further execution if elements are missing
  }

  // Function to close the popup and remember the dismissal
  function closePopup() {
    exitModal.style.opacity = "0";
    background.style.opacity = "0";
    exitModal.style.transform = "translateY(0px)";
    setTimeout(() => {
      section.style.display = "none";
    }, 1500); // Assuming the transition duration to zero opacity is 1.5 seconds
    localStorage.setItem("popupDismissed", "true"); // Store dismissal in local storage
  }

  // Check if the popup was already dismissed
  if (localStorage.getItem("popupDismissed") === "true") {
    return; // Do not show the popup if it was dismissed before
  }

  // Close popup when clicking the close button
  closeButton.addEventListener("click", closePopup);

  // Close popup when clicking on the background
  background.addEventListener("click", closePopup);

  // Close popup when pressing the escape key
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closePopup();
    }
  });

  // Detect mouse movement towards the address bar to trigger the popup
  document.addEventListener("mouseleave", function (event) {
    if (event.clientY <= 0 && localStorage.getItem("popupDismissed") !== "true") {
      // Checks if the mouse leaves through the top of the viewport and popup not dismissed
      section.style.display = "flex"; // Ensure this is the correct element to display
      setTimeout(() => {
        exitModal.style.transform = "translateY(-10px)";
        exitModal.style.opacity = "1";
        background.style.opacity = "1";
      }, 25);
    }
  });
});
