

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {

    console.log(msg);
    console.log(sender);
    sendResponse("Front the background Script");
})







// Handle incoming messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Received message in background script:", message);
  
  if (message.type === 'STATE_CHANGED') {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        if (tab.id !== sender.tab.id) {
          try {
            chrome.tabs.sendMessage(tab.id, { type: 'STATE_CHANGED', state: message.state }, (response) => {
              if (chrome.runtime.lastError) {
                console.warn(`Error sending message to tab ${tab.id}: ${chrome.runtime.lastError.message}`);
                // Optionally handle the case when there is an error but still send a normal message
                // sendResponse({ status: 'success', message: 'Message sent but error occurred' });
              } else {
                console.log(`Message sent to tab ${tab.id}:`, response);
              }
            });
          } catch (error) {
            console.error(`Unexpected error sending message to tab ${tab.id}: ${error.message}`);
            // Optionally handle unexpected errors here
            // sendResponse({ status: 'success', message: 'Message sent but unexpected error occurred' });
          }
        }
      });
    });
    sendResponse({ status: 'success' });
  }
  return true; // Indicates asynchronous response
});
