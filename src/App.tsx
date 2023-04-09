import { useEffect, useState } from 'react';
import TabTable from './TabTable';
import TabTableFilter from './TabFilter';
import './App.css';
import AppHeader from './AppHeader';

function App() {
  const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([]);
  const [textFilter, setTextFilter] = useState<string>("");
  const [audiableFilter, setAudiableFilter] = useState<boolean>(false);
  const [incognitoFilter, setIncognitoFilter] = useState<boolean>(false);

  useEffect(() => {
    updateTabList();
  }, []);

  function updateTabList() {
    let queryOptions = {};
    chrome.tabs.query(queryOptions, tabs => {
      setTabs(tabs.map(tab => { 
        if (tab.url?.startsWith("https://www.youtube.com/")) {
          tab.title = tab.title?.replace(/^\([0-9]+\) /,"");
        }
        return tab;
      }));
    });
  }

  const unmarkTabAudio = (tabId: number) => {
    setTabs(tabs.map(tab => { if (tab.id === tabId) { tab.audible = false; } return tab; }));
  }

  var searchTokens = textFilter.toLowerCase().match(/"[^"]*"|\S+/g)?.map(match => match.replace('"', '')) ?? [];
  const tabFilter = (tab: chrome.tabs.Tab) => {
      if ((audiableFilter === true) && (tab.audible === false)) {
        return false;
      }

      if ((incognitoFilter === true) && (tab.incognito === false)) {
        return false;
      }

      for (const searchToken of searchTokens) {
        if (searchToken !== "") {
          if (searchToken.startsWith("-")) {
            const negSearchToken = searchToken.substring(1);
            if (negSearchToken === "") {
              continue;
            }
            if ((tab.title?.toLowerCase().indexOf(negSearchToken) !== -1) || (tab.url?.toLowerCase().indexOf(negSearchToken) !== -1)) {
              return false;
            }
          } else {
            if ((tab.title?.toLowerCase().indexOf(searchToken) === -1) && (tab.url?.toLowerCase().indexOf(searchToken) === -1)) {
              return false;
            }
          }
        }
      }
      return true;
  }
  const filteredTabs = tabs.filter(tab => tabFilter(tab));

  return (
    <div className="p-8 overflow-auto relative">
      <AppHeader tabCount={tabs.length} displayCount={filteredTabs.length} onRefresh={updateTabList} />
      <TabTableFilter textFilter={textFilter} setTextFilter={setTextFilter} audiableFilter={audiableFilter} setAudiableFilter={setAudiableFilter} incognitoFilter={incognitoFilter} setIncognitoFilter={setIncognitoFilter}/>
      <TabTable tabs={filteredTabs} updateTabList={updateTabList} unmarkTabAudio={unmarkTabAudio} />
    </div>
  );
}

export default App;