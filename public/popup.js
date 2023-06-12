const url = chrome.runtime.getURL("index.html");
await chrome.tabs.query({ url: url }).then(tabs => {
    // Find if an tab of tab warrior is already open
    for (const tab of tabs) {
        if (tab.windowId) {
            chrome.windows.getCurrent().then(currentWindow => {
                if (currentWindow.id !== tab.windowId) {
                    chrome.windows.update(tab.windowId, { focused: true }).then(activeWindow => {
                        chrome.tabs.update(tab.id, { active: true });
                    });
                } else {
                    chrome.tabs.update(tab.id, { active: true });
                }
            });
            return;
        } else {
            chrome.tabs.update(tab.id, { active: true });
            return;
        }
    }
    // If not, open a new tab
    chrome.tabs.create({ url: url }).then(window.close);
});
