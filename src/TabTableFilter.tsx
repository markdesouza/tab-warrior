import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ChangeEventHandler} from 'react';


interface TabTableFilterProps {
    filter: string,
    onChange: ChangeEventHandler<HTMLInputElement>
}


function TabTableFilter(props: TabTableFilterProps) {
    var icon = props.filter === "" ? faMagnifyingGlass : faXmark;
    var cssClass = props.filter === "" ? "" : "cursor-pointer";
    function clearFilter() {
        props.onChange({target: {value: ""}} as React.ChangeEvent<HTMLInputElement>);
    }

    

    return (
        <div className="tabTableFilter">
            <FontAwesomeIcon icon={icon} onClick={clearFilter} className={cssClass} />
            <input type="text"  placeholder="Filter" value={props.filter} onChange={props.onChange} />
        </div>
    )
}

export default TabTableFilter;