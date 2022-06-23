import { useAppContext } from '../contexts/AppContext';
import './ConnectInfo.scss';
import ConnectGraphic from "./ConnectGraphic"
import { useEffect, useRef } from 'react';

export default function ConnectInfo() {

  const overlayRef = useRef()

  useEffect(() => {
    const timer = setTimeout(() => {
      overlayRef.current.style.opacity = "0"
    }, 1500)
    return () => {
      clearTimeout(timer)
    }
  }, [])

  return (
    <div className="container">
      <div className='loading-overlay' ref={overlayRef}></div>
      <ConnectGraphic fill={"var(--text-main)"}/>
      <p><span>CONNECT A </span><span className='text-highlighted'>TILE</span><span> TO START</span></p>
    </div>
  )
}