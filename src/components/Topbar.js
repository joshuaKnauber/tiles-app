import { useEffect, useState } from "react";
import { invoke } from '@tauri-apps/api/tauri'
import { listen } from "@tauri-apps/api/event";
import { Link } from "react-router-dom"
import { FiSettings } from "react-icons/fi"
import "./Topbar.scss";
import { useAppContext } from "../contexts/AppContext";

export default function Topbar() {
  
  const { connected } = useAppContext()

  const [lastData, setLastData] = useState(0)
  useEffect(() => {
    const unlisten = listen('received-data', event => {
      setLastData(event.payload.data)
    })
    return () => {
      Promise.resolve(unlisten)
        .then(result => result())
    }
  }, [])

  // const [name, setName] = useState("My Tiles")

  return (
    <>
      <div className="topbar-left">
        <p className={`status ${connected && "positive"}`}>{connected ? "ON ("+lastData.toString()+")" : "OFF"}</p>
        {/*<button onClick={async () => {
          const val = await invoke("get_device_status")
          console.log(val)
        }}>get</button>*/}
      </div>
      <div className="topbar-right">
        <Link to={"/settings"} className={"btn-settings"}><FiSettings size={16}/></Link>
      </div>
    </>
  )
}