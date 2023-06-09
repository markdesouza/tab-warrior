import { faSort, faSortAsc, faSortDesc, faWindowRestore, faSave, faTrashCan, faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import TabRow from './TabRow';
import { Tab, Group } from './App';

interface TabTableProps {
    tabs: Tab[]
    groups: Group[]
    showGroups: boolean
    updateTabList: Function
    onDownloadTabs: Function
    onCloseAllTabs: Function
    onPauseAllTabs: Function
    unmarkTabAudio: Function
}

function TabTable(props: TabTableProps) {
    const [sortIndex, setSortIndex] = useState<string>("");
    const [sortAsc, setSortAsc] = useState<boolean>(true);
    const [highlightDuplicate, setHighlightDuplicate] = useState<boolean>(false);

    let headers = ["", "", "", "Title", "URL"];
    if (props.showGroups) {
        headers.push("Group");
    }
    const headersColumns = headers.map((header, i) => {
        if (header === "") {
            if (i === 0) {
                return (<div className="tabTableHeader"><FontAwesomeIcon onClick={() => { props.onDownloadTabs() }} icon={faSave} className="tabActionIcon" title="Download TSV" /></div>)
            } else if (i === 1) {
                return (<div className="tabTableHeader"><FontAwesomeIcon onClick={() => { props.onCloseAllTabs() }} icon={faTrashCan} className="tabActionIcon" title="Close All Tabs" /></div>)
            } else if (i === 2) {
                return (<div className="tabTableHeader"><FontAwesomeIcon onClick={() => { props.onPauseAllTabs() }} icon={faVolumeHigh} className="tabActionIcon" title="Pause Video On All Tabs" /></div>)
            } else {
                return (<div>&nbsp;</div>);
            }
        }

        var sortIcon, sortTitle, sortCss, sortHandler;
        if (sortIndex === header) {
            if (sortAsc === true) {
                sortIcon = faSortAsc;
                sortTitle = "Sort Descending";
                sortCss = "";
                sortHandler = () => { setSortIndex(header); setSortAsc(false); }
            } else {
                sortIcon = faSortDesc;
                sortTitle = "Default Sorting";
                sortCss = "";
                sortHandler = () => { setSortIndex(""); setSortAsc(true); }
            }
        } else {
            sortIcon = faSort;
            sortTitle = "Sort Ascending";
            sortCss = "inactiveSort";
            sortHandler = () => { setSortIndex(header); setSortAsc(true); setHighlightDuplicate(false); }
        }
        var duplicateIcon = null;
        if ((sortIndex === header) && (sortIndex !== "Group")) {
            if (highlightDuplicate === false) {
                duplicateIcon = <FontAwesomeIcon icon={faWindowRestore} title="Highlight Duplicates" className="tabDisabledActionIcon" onClick={(e) => { setHighlightDuplicate(true); e.stopPropagation(); }} />
            } else {
                duplicateIcon = <FontAwesomeIcon icon={faWindowRestore} title="Do Not Highlight Duplicates" className="tabActionIcon" onClick={(e) => { setHighlightDuplicate(false); e.stopPropagation(); }} />
            }
        }

        return (
            <div onClick={sortHandler} className="tabTableHeader">
                {header}
                <FontAwesomeIcon icon={sortIcon} title={sortTitle} className={sortCss} />
                {duplicateIcon}
            </div>
        )
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

    // Detect if the browser supports favIconUrl in the tabs API
    let showFavIcon = false;
    for (let i = 0; i < sortedTabs.length; i++) {
        if (sortedTabs[i].favIconUrl !== "") {
            showFavIcon = true;
            break;
        }
    }

    let dataRows = sortedTabs.map((tab, index, tabs) => {
        var isDup = false;

        if (highlightDuplicate && (index > 0)) {
            if ((sortIndex === "Title") && (tab.title === tabs[index - 1].title)) {
                isDup = true;
            } else if ((sortIndex === "URL") && (tab.url === tabs[index - 1].url)) {
                isDup = true;
            }
        }

        return <TabRow tab={tab} highlight={isDup} groups={props.groups} showGroups={props.showGroups} showFavIcon={showFavIcon} updateTabList={props.updateTabList} unmarkTabAudio={props.unmarkTabAudio} key={tab.id} />
    }
    );
    if (dataRows.length === 0) {
        dataRows.push(<div className="w-full text-center my-3 text-sm italic ">No tabs found matching your search filter...</div>);
    }

    return (
        <div className={props.showGroups ? "tabTable" : "tabTable noTabGroups"}>
            <div className="tabTableRow">
                {headersColumns}
            </div>
            {dataRows}
        </div>
    );
}

export default TabTable;