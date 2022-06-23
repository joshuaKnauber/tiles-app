import { useAppContext } from '../contexts/AppContext';
import './ConnectInfo.scss';
import ConnectGraphic from "./ConnectGraphic"

export default function ConnectInfo() {

  return (
    <div className="container">
      <ConnectGraphic fill={"var(--text-main)"}/>
      <p><span>CONNECT </span><span className='text-highlighted'>TILE</span><span> TO START</span></p>
    </div>
  )
}