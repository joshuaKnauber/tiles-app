import { listen } from '@tauri-apps/api/event';
import { createContext, useContext, useEffect, useState } from 'react'


const AppContext = createContext();


export const AppProvider = ({ children }) => {

  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const unlisten = listen('connection-change', event => {
      setConnected(event.payload.status)
    })
    return () => {
      Promise.resolve(unlisten)
        .then(result => result())
    }
  }, [])

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