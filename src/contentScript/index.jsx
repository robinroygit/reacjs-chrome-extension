import React from "react";
import { createRoot } from "react-dom/client";
import "../assets/tailwind.css";
import ContentScript from "./contentScript";

function injectKitePublisherScript() {
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("publisher.js");
  document.body.appendChild(script);
}

// Function to inject local jQuery script
function injectJQueryScript() {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("jquery.min.js");
    script.crossOrigin = "anonymous";
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

async function init() {
  const appContainer = document.createElement("div");
  document.body.appendChild(appContainer);

  if (!appContainer) {
    throw new Error("Can not find ppContainer");
  }
  // document.body.appendChild(appContainer);
  const root = createRoot(appContainer);

  root.render(<ContentScript />);

  // injectKitePublisherScript();

  await injectJQueryScript()
    .then(() => {
      injectKitePublisherScript(); // Inject local Kite Publisher script after jQuery is loaded
    })
    .catch((error) => {
      console.error("Failed to load jQuery:", error);
    });
}

init();
