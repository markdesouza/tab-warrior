import { useEffect, useState } from 'react';
import TabTable from './TabTable';
import TabTableFilter from './TabFilter';
import './App.css';
import AppHeader from './AppHeader';
import { tabPauseVideo, tabCloseTab, PAUSE_WAIT_TIME } from './helper';

export interface Group {
    id: number
    title: string
    compareTitle: string
}

export interface Tab {
    id: number
    favIconUrl: string
    title: string
    compareTitle: string
    url: string
    compareUrl: string
    audible: boolean
    incognito: boolean
    group: Group
    windowId: number
}

function App() {
    const [tabs, setTabs] = useState<Tab[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [textFilter, setTextFilter] = useState<string>("");
    const [audiableFilter, setAudiableFilter] = useState<boolean>(false);
    const [incognitoFilter, setIncognitoFilter] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Only support tab groups in Chrome
    const showGroups = chrome.tabGroups !== undefined

    useEffect(updateTabListWithGroups, [])

    function updateTabListWithGroups() {
        setIsLoading(true);
        if (showGroups) {
            chrome.tabGroups.query({}).then(chromeGroups => {
                updateTabList(chromeGroups);
            });
        } else {
            updateTabList([]);
        }
    }

    function updateTabList(chromeGroups: chrome.tabGroups.TabGroup[]) {
        chrome.tabs.query({}).then(chromeTabs => {
            const noGroup: Group = { id: -1, title: "None", compareTitle: "none" }

            var retrievedGroups = chromeGroups.map(chromeGroup => {
                var group: Group = {
                    id: chromeGroup.id ?? -1,
                    title: chromeGroup.title ?? noGroup.title,
                    compareTitle: chromeGroup.title?.toLowerCase() ?? noGroup.compareTitle
                }
                return group
            })
            retrievedGroups.unshift(noGroup)
            setGroups(retrievedGroups);

            setTabs(chromeTabs.map(chromeTab => {
                var tab: Tab = {
                    id: chromeTab.id ?? -1,
                    title: chromeTab.title ?? "",
                    compareTitle: chromeTab.title?.toLowerCase() ?? "",
                    favIconUrl: chromeTab.favIconUrl ?? "",
                    url: chromeTab.url ?? "",
                    compareUrl: chromeTab.url?.toLowerCase() ?? "",
                    audible: chromeTab.audible ?? false,
                    incognito: chromeTab.incognito ?? false,
                    group: {
                        id: chromeTab.groupId ?? -1,
                        title: "",
                        compareTitle: ""
                    },
                    windowId: chromeTab.windowId ?? -1
                }

                if (tab.url.startsWith("https://www.youtube.com/")) {
                    tab.title = tab.title.replace(/^\([0-9]+\) /, "");
                }

                for (const group of retrievedGroups) {
                    if (group.id === tab.group.id) {
                        tab.group.title = group.title ?? "";
                        tab.group.compareTitle = tab.group.title.toLowerCase();
                        break;
                    }
                }

                return tab;
            }));
            setIsLoading(false);
        });
    }

    const unmarkTabAudio = (tabId: number) => {
        setTabs(tabs.map(tab => { if (tab.id === tabId) { tab.audible = false; } return tab; }));
    }

    var searchTokens = textFilter.toLowerCase().match(/"[^"]*"|\S+/g)?.map(match => match.replace('"', '')) ?? [];
    const tabFilter = (tab: Tab) => {
        if ((audiableFilter === true) && (tab.audible === false)) {
            return false;
        }

        if ((incognitoFilter === true) && (tab.incognito === false)) {
            return false;
        }

        for (const searchToken of searchTokens) {
            if (searchToken !== "") {
                if (searchToken.startsWith("-")) {
                    const negSearchToken = searchToken.substring(1);
                    if (negSearchToken === "") {
                        continue;
                    }
                    if ((tab.compareTitle.indexOf(negSearchToken) !== -1) || (tab.compareUrl.indexOf(negSearchToken) !== -1) || (tab.group.compareTitle.indexOf(negSearchToken) !== -1)) {
                        return false;
                    }
                } else {
                    if ((tab.compareTitle.indexOf(searchToken) === -1) && (tab.compareUrl.indexOf(searchToken) === -1) && (tab.group.compareTitle.indexOf(searchToken) === -1)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    const filteredTabs = tabs.filter(tab => tabFilter(tab));

    function downloadTabs() {
        const link = document.createElement("a");
        var content = "";
        for (const tab of filteredTabs) {
            content += tab.url + "\t" + tab.title + "\n";
        }
        const file = new Blob([content], { type: 'text/tab-separated-values' });
        link.href = URL.createObjectURL(file);
        link.download = "tabs.tsv";
        link.click();
        URL.revokeObjectURL(link.href);
    }

    function closeAllTabs() {
        const promises: Promise<void>[] = [];
        for (const tab of filteredTabs) {
            const promise = tabCloseTab(tab, null);
            promise && promises.push(promise);
        }
        Promise.all(promises).then(updateTabListWithGroups);
    }

    function pauseVideoAllTabs() {
        const promises: Promise<void>[] = [];
        for (const tab of filteredTabs) {
            if (tab.audible) {
                const promise = tabPauseVideo(tab, unmarkTabAudio, null);
                promise && promises.push(promise);
            }
        }
        Promise.all(promises).then(() => setTimeout(updateTabListWithGroups, PAUSE_WAIT_TIME));
    }

    return (
        <div className="p-8 overflow-auto relative">
            <AppHeader tabCount={tabs.length} displayCount={filteredTabs.length} onRefresh={updateTabListWithGroups} isLoading={isLoading} />
            <TabTableFilter textFilter={textFilter} setTextFilter={setTextFilter} audiableFilter={audiableFilter} setAudiableFilter={setAudiableFilter} incognitoFilter={incognitoFilter} setIncognitoFilter={setIncognitoFilter} />
            <TabTable tabs={filteredTabs} groups={groups} updateTabList={updateTabListWithGroups} onDownloadTabs={downloadTabs} onCloseAllTabs={closeAllTabs} onPauseAllTabs={pauseVideoAllTabs} unmarkTabAudio={unmarkTabAudio} showGroups={showGroups} />
        </div>
    );
}

export default App;