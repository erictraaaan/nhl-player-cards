import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import React, { useEffect, useState } from 'react';
import { getPlayers }from '../../utils/APIUtils';
import { BasePlayer} from '../../utils/types/Types';
import { ISearchBarProps } from './types/SearchBar';
import './SearchBar.scss'

const SearchBar = (props: ISearchBarProps) => {
  const IMG_SRC = "https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/";
  const [players, setPlayers] = useState<BasePlayer[]>([]);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const getPlayerData = async () => {
    await getPlayers()
    .then( (res) => {
      setPlayers(res);
    })
  }

  const getTotalPlayers = () => { 
    var skaters = 0;
    var goalies = 0;
    players.forEach( (player) => {
      if (player.position == "G") {
        goalies++;
      }
      else {
        skaters++;
      }
    })
    props.onTotalPlayers(skaters, goalies);
  }

  useEffect( () => {
    getPlayerData();
    getTotalPlayers();
  }, [])
  
    return (
      <>
      {players.length > 0 ? (
        <Autocomplete
        className="search-bar"
        id="team-select"
        sx={{ width: 300 }}
        options={players}
        autoHighlight
        popupIcon={""}
        open={open}
        onOpen={() => {
          // only open when in focus and inputValue is not empty
          if (inputValue) {
            setOpen(true);
          }
        }}
        inputValue={inputValue}
        onInputChange={(e, value, reason) => {
          setInputValue(value);
    
          // only open when inputValue is not empty after the user typed something
          if (!value) {
            setOpen(false);
          }
        }}
        onChange={(event: any, value: BasePlayer | null) => {
          props.onSelectedPlayer(value);
          setOpen(false)
        }}
        getOptionLabel={(option) => (`${option.name} (${option.teamcode})`)}
        renderOption={(props, option) => (
          <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
          <img
               loading="lazy"
               width="20"
               src={`${IMG_SRC}${option.teamid}.svg`}
               srcSet={`${IMG_SRC}${option.teamid}.svg`}
               alt=""
             />
            {option.name}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Choose a player"
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password', // disable autocomplete and autofill
            }}
          />
        )}
      />
      ) : (<p>loading...</p>)}
    </>
    );
}

export default SearchBar;