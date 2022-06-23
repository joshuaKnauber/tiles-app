import { useState } from 'react';
import { Link } from "react-router-dom"
import { open } from '@tauri-apps/api/dialog';
import { useAppContext } from '../contexts/AppContext';
import './Settings.scss';

export default function Settings() {

  const { ahkPath, updateAhkPath, scriptPath, setScriptPath } = useAppContext()

  const getAhkFile = async () => {
    const selected = await open({
      title: "Select AutoHotkey.exe",
      multiple: false,
      defaultPath: ahkPath,
      filters: [{ name: "Extensions", extensions: ["exe"] }]
    });
    if (selected) {
      updateAhkPath(selected)
    }
  }

  const getScriptFile = async () => {
    const selected = await open({
      title: "Select Autohotkey Script",
      multiple: false,
      defaultPath: scriptPath,
      filters: [{ name: "Extensions", extensions: ["ahk"] }]
    });
    if (selected) {
      setScriptPath(selected)
    }
  }

  return (
    <div className="container">
      <Link to={"/tiles"}>back</Link>
      <p>exe: {ahkPath}</p>
      <button onClick={getAhkFile}>Select AutoHotkey.exe</button>
      <p>script: {scriptPath}</p>
      <button onClick={getScriptFile}>Select Autohotkey Script</button>
    </div>
  )
}