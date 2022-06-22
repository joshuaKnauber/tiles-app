import React, { useEffect, useState } from 'react';
import { appWindow } from '@tauri-apps/api/window'
import { Route, Routes } from 'react-router-dom';
import './App.scss';
import Tiles from './components/Tiles';

function App() {

  return (
    <div className="App">

      <Routes>
        <Route path="/" element={<Tiles />} />
        <Route path="/tiles/:tileId" element={<Tiles />} />
      </Routes>

    </div>
  );
}

export default App;
