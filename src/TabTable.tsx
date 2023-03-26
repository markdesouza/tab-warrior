import React, { useEffect, useState } from 'react';


interface TabTableProps {
    filter: String
}

function TabTable(props: TabTableProps) {
    const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([]);

    useEffect(() => {
        let queryOptions = {};
        chrome.tabs.query(queryOptions, tabs => {
            setTabs(tabs);
            console.log(tabs);
        });
    }, []);


    const headers = ["Title", "URL"];
    const headersColumns = headers.map((header) =>
        <th scope="col">{header}</th>
    );

    const search = props.filter.toLowerCase();
    const dataRows = tabs.filter(
        tab => ((search === "") || 
                (tab.title?.toLowerCase().indexOf(search) != -1) || 
                (tab.url?.toLowerCase().indexOf(search) != -1))).map((tab) => 
        <TabRow tab={tab} key={tab.id} />
    );

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