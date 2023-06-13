let browserApi;
if (chrome) {
    browserApi = chrome;
} else {
    browserApi = browser;
}
const url = browserApi.runtime.getURL("index.html");

browserApi.tabs.query({ url: url }).then(tabs => {
    // Find if an tab of tab warrior is already open
    for (const tab of tabs) {
        if (tab.windowId) {
            browserApi.windows.getCurrent().then(currentWindow => {
                if (currentWindow.id !== tab.windowId) {
                    browserApi.windows.update(tab.windowId, { focused: true }).then(() => {
                        browserApi.tabs.update(tab.id, { active: true });
                    });
                } else {
                    browserApi.tabs.update(tab.id, { active: true });
                }
            });
            return;
        } else {
            browserApi.tabs.update(tab.id, { active: true });
            return;
        }
    }
    // If not, open a new tab
    browserApi.tabs.create({ url: url }).then(window.close);
});
