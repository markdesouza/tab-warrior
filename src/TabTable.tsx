import { faSort, faSortAsc, faSortDesc } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import TabRow from './TabRow';
import { Tab, Group } from './App';

interface TabTableProps {
    tabs: Tab[]
    groups: Group[]
    updateTabList: Function
    unmarkTabAudio: Function
}

function TabTable(props: TabTableProps) {
    const [sortIndex, setSortIndex] = useState<string>("");
    const [sortAsc, setSortAsc] = useState<boolean>(true);

    const headers = ["", "", "", "Title", "URL", "Group"];
    const headersColumns = headers.map((header) => {
        if (header === "") {
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
    });

    const compareTabs = (a: Tab, b: Tab) => {
        if (sortIndex === "") {
            return 0;
        }
        var aVal, bVal;
        if (sortIndex === "Title") {
            aVal = a.compareTitle;
            bVal = b.compareTitle;
        } else if (sortIndex === "URL") {
            aVal = a.compareUrl;
            bVal = b.compareUrl;
        } else { // (sortIndex === "Group") {
            aVal = a.group.compareTitle;
            bVal = b.group.compareTitle;
        }
        if (aVal > bVal) {
            return sortAsc ? 1 : -1;
        } else if (aVal < bVal) {
            return sortAsc ? -1 : 1;
        } else {
            return 0;
        }
    }
    const sortedTabs = props.tabs.sort(compareTabs);

    var dataRows = sortedTabs.map((tab) =>
        <TabRow tab={tab} groups={props.groups} updateTabList={props.updateTabList} unmarkTabAudio={props.unmarkTabAudio} key={tab.id} />
    );
    if (dataRows.length === 0) {
        dataRows.push(<div className="w-full text-center my-3 text-sm italic ">No tabs found matching your search filter...</div>);
    }

    return (
        <div className="tabTable">
            <div className="tabTableRow">
                {headersColumns}
            </div>
            {dataRows}
        </div>
    );
}

export default TabTable;