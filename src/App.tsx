import React, { useState } from 'react';
import TabTable from './TabTable';
import TabTableFilter from './TabTableFilter';
import './App.css';

function App() {
  const [filter, setFilter] = useState<string>("");
  const [tabCount, setTabCount] = useState<number>(0);

  function onFilterChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFilter(e.target.value);
  }

  return (
    <div className="p-8 overflow-auto relative">
      <div className="container flex w-fit mx-auto">
        <h1 className="text-3xl font-bold underline float-left">
          Tab Cleanup
        </h1>
        <span className="float-right mt-auto ml-4 text-sm">{"("+tabCount+" tabs)"}</span>
      </div>
      <TabTableFilter filter={filter} onChange={onFilterChange} />
      <TabTable filter={filter} onCount={setTabCount} />
    </div>
  );
}

export default App;
