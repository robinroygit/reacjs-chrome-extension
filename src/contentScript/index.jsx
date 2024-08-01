import React from "react";
import { createRoot } from "react-dom/client";
import "../assets/tailwind.css";
import { AppProvider } from "./contextApi/AppContext";
import RunBeforeContext from "./RunBeforeContext";
import ContentScript from "./contentScript";

// function injectKitePublisherScript() {
//   const script = document.createElement("script");
//   script.src = chrome.runtime.getURL("publisher.js");
//   document.body.appendChild(script);
//   console.log("publisher pushed TEST");
// }

// function injectStyles() {
//   const link = document.createElement("link");
//   link.rel = "stylesheet";
//   link.type = "text/css";
//   link.crossOrigin = "anonymous";
//   link.href = chrome.runtime.getURL("publisher.min.css");
//   document.head.appendChild(link);

//   console.log("style.css has been loaded");
//   // You can now use jQuery here, if necessary
//   // Example: $('body').css('background-color', 'yellow');
// }

// // Function to inject local jQuery script
// function injectJQueryScript() {
//   return new Promise((resolve, reject) => {
//     const script = document.createElement("script");
//     script.src = chrome.runtime.getURL("jquery.min.js");
//     script.crossOrigin = "anonymous";
//     script.onload = resolve;
//     script.onerror = reject;
//     document.body.appendChild(script);
//     console.log("jquery has been pushed TEST");
//   });
// }

async function init() {
  const appContainer = document.createElement("div");
  appContainer.id = "robin-root-div2";
  document.body.appendChild(appContainer);

  if (!appContainer) {
    throw new Error("Can not find ppContainer");
  }
  // document.body.appendChild(appContainer);
  const root = createRoot(appContainer);

  root.render(
    // <React.StrictMode>
    <AppProvider>
      <RunBeforeContext />
      {/* <ContentScript /> */}
    </AppProvider>
    // </React.StrictMode>
  );

  // injectKitePublisherScript();

  // await injectJQueryScript()
  //   .then(() => {
  //     injectKitePublisherScript(); // Inject local Kite Publisher script after jQuery is loaded
  //   })
  //   .then(() => {
  //     injectStyles();
  //   })
  //   .catch((error) => {
  //     console.error("Failed to load jQuery:", error);
  //   });
}

init();
