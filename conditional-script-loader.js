// Define the script sources for different domains
var productionScriptUrl = "https://cdn.jsdelivr.net/gh/athesing-point/pdc-calcs@115e0fc/heloc-qual-calc/heloc-qualification-calc.min.js";
var devScriptUrl = "http://127.0.0.1:5500/heloc-qual-calc/heloc-qualification-calc.js";

// QA flag
var isQA = false; // Set this to true to load the production script everywhere

var scriptUrl;

if (isQA) {
  scriptUrl = productionScriptUrl;
} else if (window.location.hostname === "point.com") {
  scriptUrl = productionScriptUrl;
} else if (window.location.hostname === "www.point.dev" || window.location.hostname === "point.dev" || /\.webflow\.io$/.test(window.location.hostname)) {
  scriptUrl = devScriptUrl;
} else {
  // Default to production URL
  scriptUrl = productionScriptUrl;
}

// Dynamically create a script element and set its source
var scriptElement = document.createElement("script");
scriptElement.src = scriptUrl;
scriptElement.defer = true; // Add the defer attribute

// Append the script element to the document's head (recommended for deferred scripts)
document.head.appendChild(scriptElement);
