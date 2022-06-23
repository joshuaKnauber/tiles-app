import { useEffect, useState } from "react";
import { invoke } from '@tauri-apps/api/tauri'
import "./Topbar.scss";
import { useAppContext } from "../contexts/AppContext";

export default function Topbar() {
  
  const { connected } = useAppContext()

  // const [name, setName] = useState("My Tiles")

  // const [ahkPath, setAhkPath] = useState("C:\\Program Files\\AutoHotkey\\AutoHotkey.exe")
  const [ahkPath, setAhkPath] = useState("")
  const [scriptPath, setScriptPath] = useState("C:\\Users\\joshu\\Desktop\\my-script.ahk")

  return (
    <>
      <div className="topbar-left">
        <p className={`status ${connected && "positive"}`}>{connected ? "ON" : "OFF"}</p>
        <input type={"file"} accept=".exe"
          value={ahkPath} onChange={e => setAhkPath(e.target.value)} />
        <input value={scriptPath}
          onChange={e => setScriptPath(e.target.value)} />
      </div>
    </>
  )
}