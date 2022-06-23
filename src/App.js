import React, { useEffect, useState } from 'react';
import { appWindow } from '@tauri-apps/api/window'
import { Route, Routes } from 'react-router-dom';
import './App.scss';
import Tiles from './components/Tiles';
import ConnectInfo from './components/ConnectInfo';
import Settings from './components/Settings';

function App() {

  return (
    <div className="App">

      <Routes>
        <Route path="/" element={<ConnectInfo />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/tiles" element={<Tiles />} />
        <Route path="/tiles/:tileId" element={<Tiles />} />
      </Routes>

    </div>
  );
}

export default App;
