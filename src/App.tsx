import React, { useEffect, useState } from 'react';
import TabTable from './TabTable';
import './App.css';

function App() {
  return (
    <div className="p-8 overflow-auto relative">
      <h1 className="text-3xl text-center font-bold underline">
        Tab Cleanup
      </h1>
      
      <TabTable />
    </div>
  );
}

export default App;
