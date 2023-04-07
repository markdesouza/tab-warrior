import { useEffect, useState } from 'react';
import TabTable from './TabTable';
import TabTableFilter from './TabTableFilter';
import './App.css';
import AppHeader from './AppHeader';
import { off } from 'process';

function App() {
  const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([]);
  const [textFilter, setTextFilter] = useState<string>("");
  const [audiableFilter, setAudiableFilter] = useState<boolean>(false);

  useEffect(() => {
    updateTabList();
  }, []);

  function updateTabList() {
    let queryOptions = {};
    chrome.tabs.query(queryOptions, tabs => {
      setTabs(tabs);
    });
  }

  const unmarkTabAudio = (tabId: number) => {
    setTabs(tabs.map(tab => { if (tab.id === tabId) { tab.audible = false; } return tab; }));
  }

  const searchTokens = textFilter.toLowerCase().split(" ");
  const tabFilter = (tab: chrome.tabs.Tab) => {
      if ((audiableFilter === true) && (tab.audible === false)) {
        return false;
      }
      for (const searchToken of searchTokens) {
        if ((searchToken !== "") && 
            (tab.title?.toLowerCase().indexOf(searchToken) === -1) && 
            (tab.url?.toLowerCase().indexOf(searchToken) === -1)) {
          return false;
        }
      }
      return true;
  }
  const filteredTabs = tabs.filter(tab => tabFilter(tab));

  return (
    <div className="p-8 overflow-auto relative">
      <AppHeader tabCount={tabs.length} displayCount={filteredTabs.length} onRefresh={updateTabList} />
      <TabTableFilter textFilter={textFilter} setTextFilter={setTextFilter} audiableFilter={audiableFilter} setAudiableFilter={setAudiableFilter} />
      <TabTable tabs={filteredTabs} updateTabList={updateTabList} unmarkTabAudio={unmarkTabAudio} />
    </div>
  );
}

export default App;