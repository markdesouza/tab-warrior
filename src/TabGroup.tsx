import { Tab, Group } from './App';

interface TabGroupProps {
    tab: Tab
    groups: Group[]
    updateTabList: Function
}


function TabGroup(props: TabGroupProps) {

    function onChange(event: any) {
        if (event.target.value === "-1") {
            chrome.tabs.ungroup(props.tab.id, () => { props.updateTabList() });
        } else {
            chrome.tabs.group({ tabIds: [props.tab.id], groupId: parseInt(event.target.value) }, () => { props.updateTabList() });
        }
    }

    return (
        <div>
            <select id={props.tab.id.toString()} onChange={onChange}>
                {
                    props.groups.map(group => {
                        return <option value={group.id} selected={props.tab.group.id === group.id}>{group.title}</option>
                    })
                }
            </select>
        </div>
    )
}

export default TabGroup;