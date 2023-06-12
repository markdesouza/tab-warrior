import { Tab } from './App';

export function tabPauseVideo(tab: Tab, unmarkTabAudio: Function, updateTabList: Function | null) {
    if (tab.id) {
        chrome.scripting.executeScript({ target: { tabId: tab.id }, func: pauseVideo }).then(() => {
            // Fake the tab as not playing audio 
            unmarkTabAudio(tab.id);
            if (updateTabList) {
               // until the browser registers the change and the list is refreshed
                setTimeout(function () {
                    updateTabList()
                }, 3000);
            }
        }
        );
    }
}

function pauseVideo() {
    //@ts-ignore
    document.getElementsByClassName('ytp-play-button')[0].click();
}

export function tabCloseTab(tab: Tab, updateTabList: Function | null) {
    if (tab.id) {
        chrome.tabs.remove(tab.id, () => {
            updateTabList && updateTabList();
        });
    }
}

export function tabSwitchToTab(tab: Tab) {
    if (tab.windowId) {
        chrome.windows.update(tab.windowId, { focused: true }, (window) => {
            if (tab.id) {
                chrome.tabs.update(tab.id, { active: true });
            }
        })
    }
}
