import React, { useState } from 'react';
import TabTable from './TabTable';
import TabTableFilter from './TabTableFilter';
import './App.css';

function App() {
  const [filter, setFilter] = useState<string>("");

  function onFilterChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFilter(e.target.value);
  }

  return (
    <div className="p-8 overflow-auto relative">
      <h1 className="text-3xl text-center font-bold underline">
        Tab Cleanup
      </h1>
      <TabTableFilter filter={filter} onChange={onFilterChange} />
      <TabTable filter={filter} />
    </div>
  );
}

export default App;
