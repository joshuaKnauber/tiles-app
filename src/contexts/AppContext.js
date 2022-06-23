import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { listen } from '@tauri-apps/api/event';
import { send_notification } from '../utils/notification';


const AppContext = createContext();


export const AppProvider = ({ children }) => {

  const navigate = useNavigate()

  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const unlisten = listen('connection-change', event => {
      setConnected(event.payload.status)
      if (event.payload.status) {
        navigate("/tiles")
        send_notification("Connected", "Your Tile has been connected!")
      } else {
        send_notification("Disconnected", "Your Tile has been disconnected!")
      }
    })
    return () => {
      Promise.resolve(unlisten)
        .then(result => result())
    }
  }, [navigate])

  const appState = {
    connected,
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