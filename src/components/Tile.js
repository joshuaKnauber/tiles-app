import "./Grid.scss";
import { FaCrown } from 'react-icons/fa'
import { useNavigate, useParams } from "react-router-dom";
import { useMemo, useState } from "react";

export default function Tile({ placeholder=false, core=false, title="" }) {

  const navigate = useNavigate()
  const params = useParams()

  const id = useMemo(() => {
    return `${core ? 'Core' : title ? title : 'Tile'}`
  }, [core, title])

  const isActive = useMemo(() => {
    return params.tileId === id
  }, [id, params])

  const goToTile = () => {
    if (placeholder) return
    if (params.tileId === id) {
      navigate('/tiles')
    } else {
      navigate(`/tiles/${id}`)
    }
  }


  return (
    <div onClick={goToTile}
      className="grid-element">
      <div className={`${placeholder ? '' : 'tile'} ${core ? 'core' : ''} ${isActive ? 'active' : ''}`}>
        {!placeholder && core && <FaCrown size={30}/>}
        {!placeholder && <p>{core ? "" : title||"Tile"}</p>}
      </div>
      {!placeholder && <div className="connectors">
        <div className="connector"></div>
        <div className="connector connector--vertical"></div>
      </div>}
    </div>
  )
}