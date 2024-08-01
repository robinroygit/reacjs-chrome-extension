import React, { useEffect } from "react";
import { useAppContext } from "./contextApi/AppContext";
import ContentScript from "./contentScript";

const RunBeforeContext = () => {
  const { selectedSymbol } = useAppContext();

  function injectKitePublisherScript() {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("publisher.js");
    script.id = "kitePublisherScript";
    document.body.appendChild(script);
    // console.log("publisher pushed TEST");
  }

  function injectStyles() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.crossOrigin = "anonymous";
    link.href = chrome.runtime.getURL("publisher.min.css");
    link.id = "kitePublisherStyle";
    document.head.appendChild(link);

    // console.log("style.css has been loaded");
  }

  function injectJQueryScript() {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = chrome.runtime.getURL("jquery.min.js");
      script.crossOrigin = "anonymous";
      script.id = "jQueryScript";
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
      // console.log("jquery has been pushed TEST");
    });
  }

  function removeInjectedScripts() {
    const scripts = ["kitePublisherScript", "jQueryScript"];
    const style = document.getElementById("kitePublisherStyle");

    scripts.forEach((id) => {
      const script = document.getElementById(id);
      if (script) {
        document.body.removeChild(script);
      }
    });

    if (style) {
      document.head.removeChild(style);
    }

    console.log("Previous scripts and styles removed");
  }

  useEffect(() => {
    removeInjectedScripts(); // Clean up previous scripts before injecting new ones

    injectJQueryScript()
      .then(() => {
        injectStyles();
      })
      .then(() => {
        injectKitePublisherScript(); // Inject local Kite Publisher script after jQuery is loaded
      })
      .catch((error) => {
        console.error("Failed to load jQuery:", error);
      });
  }, []);

  return <ContentScript />;
};

export default RunBeforeContext;
