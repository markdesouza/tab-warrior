import { faMagnifyingGlass, faVolumeHigh, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';


interface TabTableFilterProps {
    textFilter: string
    setTextFilter: Function
    audiableFilter: boolean
    setAudiableFilter: Function
}

function TabTableFilter(props: TabTableFilterProps) {
    var clearCssClass = props.textFilter !== "" ? "tabTableFilterOn" : "tabTableFilterDisabled";
    var audiableCssClass = props.audiableFilter ? "tabTableFilterOn" : "tabTableFilterOff";

    function clearFilter() {
        props.setTextFilter("");
        props.setAudiableFilter(false);
    }

    function onTextFiltertChange(e: React.ChangeEvent<HTMLInputElement>) {
        props.setTextFilter(e.target.value);
    }

    function toggleAudiableFilter() {
        props.setAudiableFilter(!props.audiableFilter);
    }

    return (
        <div className="tabTableFilter">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            <input type="text"  placeholder="Filter" value={props.textFilter} onChange={onTextFiltertChange} />
            <FontAwesomeIcon icon={faVolumeHigh} onClick={toggleAudiableFilter} className={audiableCssClass} />
            <FontAwesomeIcon icon={faXmark} onClick={clearFilter} className={clearCssClass} />
        </div>
    )
}

export default TabTableFilter;