import React, { useEffect, useState } from 'react';

function TabTable() {
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

    const dataRows = tabs.map((tab) =>
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