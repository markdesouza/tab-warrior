import { Tab } from './App';

export const PAUSE_WAIT_TIME = 3000;

export function tabPauseVideo(tab: Tab, unmarkTabAudio: Function, updateTabList: Function | null): Promise<void> | undefined {
    if (!tab.id) {
        return undefined
    }

    return chrome.scripting.executeScript({ target: { tabId: tab.id }, func: pauseVideo }).then(() => {
        // Fake the tab as not playing audio
        unmarkTabAudio(tab.id);
        if (updateTabList) {
            // until the browser registers the change and the list is refreshed
            setTimeout(updateTabList, PAUSE_WAIT_TIME);
        }
    });
}

function pauseVideo() {
    //@ts-ignore
    document.getElementsByClassName('ytp-play-button')[0].click();
}

export function tabCloseTab(tab: Tab, updateTabList: Function | null): Promise<void> | undefined {
    if (!tab.id) {
        return undefined
    }
    return chrome.tabs.remove(tab.id).then(() => {
        updateTabList && updateTabList();
    });
}

export function tabSwitchToTab(tab: Tab): Promise<void> | undefined {
    if (!tab.windowId) {
        return undefined;
    }
    return chrome.windows.update(tab.windowId, { focused: true }).then((window) => {
        if (tab.id) {
            chrome.tabs.update(tab.id, { active: true });
        }
    });
}
