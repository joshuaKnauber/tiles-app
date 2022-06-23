import { useState } from 'react';
import { Link } from "react-router-dom"
import { open } from '@tauri-apps/api/dialog';
import { useAppContext } from '../contexts/AppContext';
import './Settings.scss';

export default function Settings() {

  const { ahkPath, updateAhkPath } = useAppContext()

  // const [ahkPath, setAhkPath] = useState("C:\\Program Files\\AutoHotkey\\AutoHotkey.exe")
  const [scriptPath, setScriptPath] = useState("C:\\Users\\joshu\\Desktop\\my-script.ahk")

  const getAhkFile = async () => {
    const selected = await open({
      title: "Select AutoHotkey.exe",
      multiple: false,
      filters: [{ name: "Extensions", extensions: ["exe"] }]
    });
    if (selected) {
      updateAhkPath(selected)
    }
  }

  return (
    <div className="container">
      <Link to={"/tiles"}>back</Link>
      <p>path: {ahkPath}</p>
      <button onClick={getAhkFile}>select file</button>
      <input value={scriptPath}
        onChange={e => setScriptPath(e.target.value)} />
    </div>
  )
}