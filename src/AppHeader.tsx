import { faRotate } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface AppHeaderProps {
    tabCount: Number
    displayCount: Number
    onRefresh: Function
}

function AppHeader(props: AppHeaderProps) {
    var tabCountText = "(" + props.tabCount + " tabs)";
    if (props.tabCount !== props.displayCount) {
        tabCountText = "(" + props.displayCount + " of "+ props.tabCount + " tabs)"
    }

    return (
        <div className="container flex w-fit mx-auto">
            <img src="images/logo-48.png" className="float-left h-8 mt-1 mr-3" />
            <h1 className="text-3xl font-bold underline float-left">
                Tab Warrior
            </h1>
            <span className="float-right mt-auto ml-4 text-sm">
                {tabCountText}
                <FontAwesomeIcon onClick={() => { props.onRefresh() }} icon={faRotate} className="updateTabList" />
            </span>
        </div>
    );
}

export default AppHeader;
