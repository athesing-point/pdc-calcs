// Alert module for calculator results
const createAlertHandler = () => {
  let isInitialCalculation = true;
  const alertElement = document.querySelector(".calc-alert");

  // Return a no-op handler if alert element doesn't exist
  if (!alertElement) {
    return {
      showAlert: () => {}, // No-op function
      setInitialCalculationComplete: () => {
        isInitialCalculation = false;
      },
    };
  }

  const showAlert = (message = "Results updated") => {
    if (!isInitialCalculation) {
      alertElement.textContent = message;
      alertElement.classList.remove("hide");
      // Hide alert after 1.5 seconds
      setTimeout(() => {
        alertElement.classList.add("hide");
      }, 1500);
    }
  };

  const setInitialCalculationComplete = () => {
    isInitialCalculation = false;
  };

  return {
    showAlert,
    setInitialCalculationComplete,
  };
};

export default createAlertHandler;
