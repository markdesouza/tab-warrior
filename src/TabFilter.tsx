import { faGlasses, faMagnifyingGlass, faVolumeHigh, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

interface TabTableFilterProps {
    textFilter: string
    setTextFilter: Function
    audiableFilter: boolean
    setAudiableFilter: Function
    incognitoFilter: boolean
    setIncognitoFilter: Function
}

function TabTableFilter(props: TabTableFilterProps) {
    var clearCssClass = (props.textFilter !== "" || props.audiableFilter || props.incognitoFilter) ? "tabTableFilterOn" : "tabTableFilterDisabled";
    var audiableCssClass = props.audiableFilter ? "tabTableFilterOn" : "tabTableFilterOff";
    var incognitoCssClass = props.incognitoFilter ? "tabTableFilterOn" : "tabTableFilterOff";

    var audiableTitle = props.audiableFilter ? "Turn off audiable filter" : "Only show tabs that are currently audiable";
    var incognitoTitle = props.incognitoFilter ? "Turn off incognito filter" : "Only show tabs that are incognito";

    function clearFilter() {
        props.setTextFilter("");
        props.setAudiableFilter(false);
        props.setIncognitoFilter(false);
    }

    function onTextFiltertChange(e: React.ChangeEvent<HTMLInputElement>) {
        props.setTextFilter(e.target.value);
    }

    function toggleAudiableFilter() {
        props.setAudiableFilter(!props.audiableFilter);
    }

    function toggleIncognitoFilter() {
        props.setIncognitoFilter(!props.incognitoFilter);
    }

    return (
        <div className="tabTableFilter">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            <input type="text"  placeholder="Filter" value={props.textFilter} onChange={onTextFiltertChange} />
            <FontAwesomeIcon icon={faVolumeHigh} onClick={toggleAudiableFilter} className={audiableCssClass} title={audiableTitle} />
            <FontAwesomeIcon icon={faGlasses} onClick={toggleIncognitoFilter} className={incognitoCssClass} title={incognitoTitle} />
            <FontAwesomeIcon icon={faXmark} onClick={clearFilter} className={clearCssClass} />
        </div>
    )
}

export default TabTableFilter;