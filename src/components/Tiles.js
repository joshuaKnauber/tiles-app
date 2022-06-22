import { Link, useParams } from "react-router-dom";
import SimpleBar from 'simplebar-react';
import { useAppContext } from "../contexts/AppContext";
import Grid from "./Grid";
import './Tiles.scss';
import Topbar from "./Topbar";

export default function Tiles() {

  const params = useParams()
  const { connected } = useAppContext()

  return (
    <div className="page">
      <div className="topbar-container">
        <Topbar/>
      </div>
      <div className="content">
        {!connected && <div className="content-overlay"></div>}
        <SimpleBar className="grid-container">
          <Grid/>
        </SimpleBar>
        <div className={`settings-container ${params.tileId && 'visible'}`}>
          <p>{params.tileId}</p>
          <Link to={'/'}>Home</Link>
        </div>
      </div>
    </div>
  )
}