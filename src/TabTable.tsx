import { faSort, faSortAsc, faSortDesc } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';


interface TabTableProps {
    filter: String
}

function TabTable(props: TabTableProps) {
    const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([]);
    const [sortIndex, setSortIndex] = useState<string>("");
    const [sortAsc, setSortAsc] = useState<boolean>(true);

    useEffect(() => {
        let queryOptions = {};
        chrome.tabs.query(queryOptions, tabs => {
            setTabs(tabs);
            console.log(tabs);
        });
    }, []);


    const headers = ["Title", "URL"];
    const headersColumns = headers.map((header) => {
            if (header == "") {
                return (<th scope="col" />);
            }

            var sortIcon, clickHandler;
            if (sortIndex === header) {
                if (sortAsc === true) {
                    sortIcon = faSortAsc;
                    clickHandler = () => { setSortIndex(header); setSortAsc(false); }
                } else {
                    sortIcon = faSortDesc;
                    clickHandler = () => { setSortIndex(""); setSortAsc(true); }
                }
            } else {
                sortIcon = faSort;
                clickHandler = () => { setSortIndex(header); setSortAsc(true); }
            }

            return (<th scope="col" onClick={clickHandler} >{header} <FontAwesomeIcon icon={sortIcon} /></th>)
        }
    );

    const compareTabs = (a:chrome.tabs.Tab, b:chrome.tabs.Tab) => {
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
        <TabRow tab={tab} key={tab.id} />
    );
        tabs.sort()
    return (
        <table className="tabTable">
            <tr>
                {headersColumns}
            </tr>
            {dataRows}
        </table>
    );
}


interface TabRowProps {
    tab: chrome.tabs.Tab
}

function TabRow(props: TabRowProps) {
    return (
        <tr>
            <td>{props.tab.title}</td>
            <td>{props.tab.url}</td>
        </tr>
    );
}

export default TabTable;