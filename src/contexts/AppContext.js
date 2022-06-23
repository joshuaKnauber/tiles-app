import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api';
import { send_notification } from '../utils/notification';


const AppContext = createContext();


export const AppProvider = ({ children }) => {

  const navigate = useNavigate()

  const [connected, setConnected] = useState(false)

  const [ahkPath, setAhkPath] = useState("C:\\Program Files\\AutoHotkey\\AutoHotkey.exe")
  const [scriptPath, setScriptPath] = useState("C:\\Users\\joshu\\Desktop\\my-script.ahk")

  useEffect(() => {
    const unlisten = listen('connection-change', event => {
      setConnected(event.payload.status)
      if (event.payload.status) {
        navigate("/tiles")
        send_notification("Connected", "Tile connected!")
      } else {
        send_notification("Disconnected", "Tile disconnected!")
      }
    })
    return () => {
      Promise.resolve(unlisten)
        .then(result => result())
    }
  }, [navigate])

  const initializeBackendValues = async () => {
    const deviceStatus = await invoke("get_device_status")
    setConnected(deviceStatus)
  }

  const updateAhkPath = (newPath) => {
    setAhkPath(newPath)
    invoke("update_ahk_path", { path: newPath })
  }

  useEffect(() => {
    initializeBackendValues()
  }, [])

  const appState = {
    connected,

    ahkPath,
    updateAhkPath,
    scriptPath,
    setScriptPath,
  }

  return (
    <AppContext.Provider value={appState}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  return useContext(AppContext);
}