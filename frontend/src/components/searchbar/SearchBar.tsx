import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete , {createFilterOptions} from '@mui/material/Autocomplete';
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
      getTotalPlayers(res);
    })
  }

  const getTotalPlayers = (rawPlayers: BasePlayer[]) => { 
    var skaters = 0;
    var goalies = 0;
    rawPlayers.forEach( (player) => {
      if (player.position == "G") {
        goalies++;
      }
      else {
        skaters++;
      }
    })
    props.onTotalPlayers(skaters, goalies);
  }

  const filterOptions = createFilterOptions({
    limit:10
  });

  useEffect( () => {
    getPlayerData();
  }, [])
  
    return (
      <>
      {players.length > 0 ? (
        <Autocomplete
        filterOptions={filterOptions}
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
        onChange={(event: any, value: any) => {
          props.onSelectedPlayer(value);
          setOpen(false)
        }}
        getOptionLabel={(option: any) => (`${option.name} (${option.teamcode})`)}
        renderOption={(props, option: any) => (
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
              ...params.inputProps, endAdornment : null,
              autoComplete: 'new-password', // disable autocomplete and autofill
            }}
          />
        )}
      />
      ) : (
      <div className='loading-wrapper'>
        <div className='loader'></div>
        <p>loading data...</p>
      </div>
      )}
    </>
    );
}

export default SearchBar;