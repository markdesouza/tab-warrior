import { faEye, faSort, faSortAsc, faSortDesc, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';


interface TabTableProps {
    filter: String
    onCount: Function
}

function TabTable(props: TabTableProps) {
    const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([]);
    const [sortIndex, setSortIndex] = useState<string>("");
    const [sortAsc, setSortAsc] = useState<boolean>(true);

    useEffect(() => {
        updateTabList();
    }, []);

    function updateTabList() {
        let queryOptions = {};
        chrome.tabs.query(queryOptions, tabs => {
            setTabs(tabs);
            props.onCount(tabs.length);
        });
    }

    const headers = ["", "", "Title", "URL"];
    const headersColumns = headers.map((header) => {
        if (header == "") {
            return (<div>&nbsp;</div>);
        }

        var sortIcon, sortTitle, sortCss, clickHandler;
        if (sortIndex === header) {
            if (sortAsc === true) {
                sortIcon = faSortAsc;
                sortTitle = "Sort Descending";
                sortCss = "";
                clickHandler = () => { setSortIndex(header); setSortAsc(false); }
            } else {
                sortIcon = faSortDesc;
                sortTitle = "Default Sorting";
                sortCss = "";
                clickHandler = () => { setSortIndex(""); setSortAsc(true); }
            }
        } else {
            sortIcon = faSort;
            sortTitle = "Sort Ascending";
            sortCss = "inactiveSort";
            clickHandler = () => { setSortIndex(header); setSortAsc(true); }
        }

        return (<div onClick={clickHandler} className="tabTableHeader">{header} <FontAwesomeIcon icon={sortIcon} title={sortTitle} className={sortCss} /></div>)
    }
    );

    const compareTabs = (a: chrome.tabs.Tab, b: chrome.tabs.Tab) => {
        if (sortIndex == "") {
            return 0;
        }
        var aVal, bVal;
        if (sortIndex == "Title") {
            aVal = a.title?.toLowerCase() ?? "";
            bVal = b.title?.toLowerCase() ?? "";
        } else {
            aVal = a.url?.toLowerCase() ?? "";
            bVal = b.url?.toLowerCase() ?? "";
        }
        if (aVal > bVal) {
            return sortAsc ? 1 : -1;
        } else if (aVal < bVal) {
            return sortAsc ? -1 : 1;
        } else {
            return 0;
        }
    }

    const search = props.filter.toLowerCase();
    const dataRows = tabs.filter(
        tab => ((search === "") ||
            (tab.title?.toLowerCase().indexOf(search) !== -1) ||
            (tab.url?.toLowerCase().indexOf(search) !== -1))).sort(compareTabs).map((tab) =>
                <TabRow tab={tab} updateTabList={updateTabList} key={tab.id} />
            );
    tabs.sort()
    return (
        <div className="tabTable">
            <div className="tabTableRow">
                {headersColumns}
            </div>
            {dataRows}
        </div>
    );
}


interface TabRowProps {
    tab: chrome.tabs.Tab
    updateTabList: Function
}

function TabRow(props: TabRowProps) {

    function switchToTab() {
        if (props.tab.windowId) {
            chrome.windows.update(props.tab.windowId, {focused: true}, (window) => {
                if (props.tab.id) {
                    chrome.tabs.update(props.tab.id, { active: true });
                }
            })
        }
    }

    function closeTab() {
        if (props.tab.id) {
            chrome.tabs.remove(props.tab.id, () => {
                props.updateTabList();
            });
        }
    }

    return (
        <div className="tabTableRow">
            <div><FontAwesomeIcon onClick={switchToTab} icon={faEye} className="tabActionIcon" title="Switch to Tab" /></div>
            <div><FontAwesomeIcon onClick={closeTab} icon={faTrashCan} className="tabActionIcon" title="Close Tab" /></div>
            <div>{props.tab.title}</div>
            <div>{props.tab.url}</div>
        </div>
    );
}

export default TabTable;