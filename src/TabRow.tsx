import { faEye, faGlasses, faTrashCan, faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TabGroup from './TabGroup';
import { Tab, Group } from './App';

interface TabRowProps {
    tab: Tab
    groups: Group[]
    updateTabList: Function
    unmarkTabAudio: Function
}

function TabRow(props: TabRowProps) {
    function switchToTab() {
        if (props.tab.windowId) {
            chrome.windows.update(props.tab.windowId, { focused: true }, (window) => {
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

    var audioCssClass = props.tab.audible ? "tabActionIcon" : "tabDisabledActionIcon";
    var audioTitle = props.tab.audible ? "Tab is playing audio" : "Tab is not playing audio";

    function pauseAudio() {
        //@ts-ignore
        document.getElementsByClassName('ytp-play-button')[0].click();
    }

    function pauseTabAudio() {
        if (props.tab.id) {
            chrome.scripting.executeScript({ target: { tabId: props.tab.id }, func: pauseAudio }).then(() => {
                // Fake the tab as not playing audio 
                props.unmarkTabAudio(props.tab.id);
                // until the browser registers the change and the list is refreshed
                setTimeout(function () {
                    props.updateTabList()
                }, 3000);
            }
            );
        }
    }

    function hideBadFavIcon(e: any) {
        e.target.style.opacity = "0";
    }

    return (
        <div className="tabTableRow">
            <div><FontAwesomeIcon onClick={switchToTab} icon={faEye} className="tabActionIcon" title="Switch to Tab" /></div>
            <div><FontAwesomeIcon onClick={closeTab} icon={faTrashCan} className="tabActionIcon" title="Close Tab" /></div>
            <div><FontAwesomeIcon onClick={pauseTabAudio} icon={faVolumeHigh} className={audioCssClass} title={audioTitle} /></div>
            <div>
                <img src={props.tab.favIconUrl} className="tabFavicon" onError={hideBadFavIcon} />
                {props.tab.incognito && <FontAwesomeIcon icon={faGlasses} />}
                {props.tab.title}
            </div>
            <div>{props.tab.url}</div>
            <TabGroup tab={props.tab} groups={props.groups} updateTabList={props.updateTabList} />
        </div>
    );
}

export default TabRow;