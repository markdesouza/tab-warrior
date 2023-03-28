import { useEffect, useState } from 'react';
import TabTable from './TabTable';
import TabTableFilter from './TabTableFilter';
import { faRotate } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './App.css';

function App() {
  const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([]);
  const [textFilter, setTextFilter] = useState<string>("");
  const [audiableFilter, setAudiableFilter] = useState<boolean>(false);
  const [tabCount, setTabCount] = useState<number>(0);

  useEffect(() => {
    updateTabList();
  }, []);

  function updateTabList() {
    let queryOptions = {};
    chrome.tabs.query(queryOptions, tabs => {
      setTabs(tabs);
      setTabCount(tabs.length);
    });
  }

  const unmarkTabAudio = (tabId: number) => {
    setTabs(tabs.map(tab => { if (tab.id === tabId) { tab.audible = false; } return tab; }));
  }

  return (
    <div className="p-8 overflow-auto relative">
      <div className="container flex w-fit mx-auto">
        <h1 className="text-3xl font-bold underline float-left">
          Tab Cleanup
        </h1>
        <span className="float-right mt-auto ml-4 text-sm">
          {"(" + tabCount + " tabs)"}
          <FontAwesomeIcon onClick={updateTabList} icon={faRotate} className="updateTabList" />
        </span>
      </div>
      <TabTableFilter textFilter={textFilter} setTextFilter={setTextFilter} audiableFilter={audiableFilter} setAudiableFilter={setAudiableFilter} />
      <TabTable tabs={tabs} textFilter={textFilter} audiableFilter={audiableFilter} onCount={setTabCount} updateTabList={updateTabList} unmarkTabAudio={unmarkTabAudio} />
    </div>
  );
}

export default App;