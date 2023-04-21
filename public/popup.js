const url = chrome.runtime.getURL("index.html");
chrome.tabs.query({ url: url }, (tabs) => {
  // Find if an tab of tab warrior is already open
  for (const tab of tabs) {
    if (tab.windowId) {
      chrome.windows.getCurrent((currentWindow) => {
        if (currentWindow.id !== tab.windowId) {
          chrome.windows.update(tab.windowId, { focused: true }, (activeWindow) => {
            chrome.tabs.update(tab.id, { active: true });
          });
        } else {
          chrome.tabs.update(tab.id, { active: true });
        }
      });
      return;
    }
    // If not, open a new tab
    chrome.tabs.create({ url: url }, () => {
      window.close();
    });
  }
});
