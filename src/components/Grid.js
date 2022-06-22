import Tile from "./Tile";
import "./Grid.scss";

export default function Grid() {
  return (
    <div className="grid">
      <div className="grid-row">
        <Tile placeholder/>
        <Tile title="one" />
        <Tile title="two" />
        <Tile placeholder/>
        <Tile placeholder/>
      </div>
      <div className="grid-row">
        <Tile title="three" core />
        <Tile title="hello" />
        <Tile title="four" />
        <Tile title="five" />
        <Tile title="six" />
      </div>
      <div className="grid-row">
        <Tile placeholder/>
        <Tile title="seven" />
        <Tile placeholder/>
        <Tile placeholder/>
        <Tile placeholder/>
      </div>
    </div>
  )
}