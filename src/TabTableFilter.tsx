import React, { ChangeEventHandler} from 'react';


interface TabTableFilterProps {
    filter: string,
    onChange: ChangeEventHandler<HTMLInputElement>
}


function TabTableFilter(props: TabTableFilterProps) {
    return (
        <input type="text" className="tabTableFilter" placeholder="Filter" value={props.filter} onChange={props.onChange} />
    )
}

export default TabTableFilter;