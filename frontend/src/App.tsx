import React, { useEffect, useState } from 'react';
import './App.scss';
import PlayerCard from './components/playercard/PlayerCard';
import SearchBar from './components/searchbar/SearchBar'
import { BasePlayer } from './utils/types/Types';

function App() {
  const [selectedBasePlayer, setSelectedBasePlayer] = useState<BasePlayer | null>(null);

  const handleSelectedBasePlayerChange = (player: BasePlayer| null) => {
    setSelectedBasePlayer(player)
  }

  return (
    <div className="App">
      <SearchBar onSelectedPlayer={handleSelectedBasePlayerChange}/>
      {!!selectedBasePlayer && (
        <PlayerCard player={selectedBasePlayer}/>
      )}
    </div>
  );
}

export default App;
