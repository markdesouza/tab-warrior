import { faEye, faGlasses, faTrashCan, faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TabGroup from './TabGroup';
import { Tab, Group } from './App';
import {tabPauseVideo, tabCloseTab, tabSwitchToTab} from './helper';

interface TabRowProps {
    tab: Tab
    highlight: boolean
    groups: Group[]
    showGroups: boolean
    updateTabList: Function
    unmarkTabAudio: Function
}

function TabRow(props: TabRowProps) {

    function closeTab() {
        tabCloseTab(props.tab, props.updateTabList); 
    }

    function pauseVideo() {
        tabPauseVideo(props.tab, props.unmarkTabAudio, props.updateTabList);       
    }

    function switchToTab() {
        tabSwitchToTab(props.tab);
    }

    function hideBadFavIcon(e: any) {
        e.target.style.opacity = "0";
    }

    var audioCssClass = props.tab.audible ? "tabActionIcon" : "tabDisabledActionIcon";
    var audioTitle = props.tab.audible ? "Tab is playing audio" : "Tab is not playing audio";

    return (
        <div className={props.highlight ? "tabTableRow highlightTab" : "tabTableRow"} >
            <div><FontAwesomeIcon onClick={switchToTab} icon={faEye} className="tabActionIcon" title="Switch to Tab" /></div>
            <div><FontAwesomeIcon onClick={closeTab} icon={faTrashCan} className="tabActionIcon" title="Close Tab" /></div>
            <div><FontAwesomeIcon onClick={pauseVideo} icon={faVolumeHigh} className={audioCssClass} title={audioTitle} /></div>
            <div>
                <img src={props.tab.favIconUrl} onClick={switchToTab} className="tabFavicon cursor-pointer" onError={hideBadFavIcon} />
                {props.tab.incognito && <FontAwesomeIcon icon={faGlasses} onClick={switchToTab} className="cursor-pointer" />}
                <span onClick={switchToTab} className="cursor-pointer">{props.tab.title}</span>
            </div>
            <div><span onClick={switchToTab} className="cursor-pointer">{props.tab.url}</span></div>
            {props.showGroups && <TabGroup tab={props.tab} groups={props.groups} updateTabList={props.updateTabList} />}
        </div>
    );
}

export default TabRow;