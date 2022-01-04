import React, { useEffect, useState } from 'react';
import './App.scss';
import PlayerCard from './components/playercard/PlayerCard';
import SearchBar from './components/searchbar/SearchBar'
import { BasePlayer } from './utils/types/Types';

function App() {
  const [selectedBasePlayer, setSelectedBasePlayer] = useState<BasePlayer | null>(null);
  const [skaterCount , setSkaterCount ] = useState<number | null>(null);
  const [goalieCount , setGoalieCount ] = useState<number | null>(null);

  const handleSelectedBasePlayerChange = (player: BasePlayer| null) => {
    setSelectedBasePlayer(player)
  }

  const handleTotalPlayersChange = (skaters: number, goalies: number ) => {
    setSkaterCount(skaters);
    setGoalieCount(goalies);
  }

  return (
    <div className="App">
      {!!!selectedBasePlayer && (
        <>
        <h2>NHL Player Cards</h2>
        <p>View stats about any player currently playing in the NHL.</p>
        </>
      )}
      <SearchBar onSelectedPlayer={handleSelectedBasePlayerChange} onTotalPlayers={handleTotalPlayersChange}/>
      {!!selectedBasePlayer && !!skaterCount && !!goalieCount && (
        <PlayerCard player={selectedBasePlayer} totalPlayers={skaterCount} totalGoalies={goalieCount}/>
      )}
      <p>Created by <a href="https://github.com/erictraaaan" target="_blank">Eric Tran</a></p>
    </div>
  );
}

export default App;
