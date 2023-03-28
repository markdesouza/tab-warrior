import { useState } from 'react';
import TabTable from './TabTable';
import TabTableFilter from './TabTableFilter';
import './App.css';

function App() {
  const [textFilter, setTextFilter] = useState<string>("");
  const [audiableFilter, setAudiableFilter] = useState<boolean>(false);
  const [tabCount, setTabCount] = useState<number>(0);

  return (
    <div className="p-8 overflow-auto relative">
      <div className="container flex w-fit mx-auto">
        <h1 className="text-3xl font-bold underline float-left">
          Tab Cleanup
        </h1>
        <span className="float-right mt-auto ml-4 text-sm">{"("+tabCount+" tabs)"}</span>
      </div>
      <TabTableFilter textFilter={textFilter} setTextFilter={setTextFilter} audiableFilter={audiableFilter} setAudiableFilter={setAudiableFilter} />
      <TabTable textFilter={textFilter} audiableFilter={audiableFilter} onCount={setTabCount} />
    </div>
  );
}

export default App;
