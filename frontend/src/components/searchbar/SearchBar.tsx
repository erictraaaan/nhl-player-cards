import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import React, { useEffect, useState } from 'react';
import { getPlayers, getTeams }from '../../utils/APIUtils';
import { Team , BasePlayer} from '../../utils/types/Types';
import { ISearchBarProps } from './types/SearchBar';
import { makeStyles } from '@mui/material';


const SearchBar = (props: ISearchBarProps) => {
  const IMG_SRC = "https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/";

  // const [teams, setTeams] = useState<Team[]>([]);

  const [players, setPlayers] = useState<BasePlayer[]>([]);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // const getTeamData = async () => {
  //   await getTeams()
  //   .then( (res) => {
  //     res.sort( (a,b) => {
  //         var aText = a.name;
  //         var bText = b.name;
  //         return (aText < bText) ? -1 : (aText > bText) ? 1 : 0;
  //     });
  //     setTeams(res);
  //   })
  // }

  // const AutocompleteStyles = makeStyles( (theme: any) => ({
  //   endAdornment: {
  //       display: 'none'
  //   }
  // }))
  // const autocompleteStyles = AutocompleteStyles();

  const getPlayerData = async () => {
    await getPlayers()
    .then( (res) => {
      setPlayers(res);
    })
  }

  useEffect( () => {
    // getTeamData();
    getPlayerData();
  }, [])
  
    return (
      <>
      {players.length > 0 ? (
        <Autocomplete
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