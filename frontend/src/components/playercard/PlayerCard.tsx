import React, { useEffect, useState } from 'react'
import Modal from '@mui/material/Modal';
import { IPlayerCardProps } from './types/PlayerCard';
import Box from '@mui/material/Box';
import { getPlayerRankStats, getPlayerBasicStats, getPlayerInfo, getShootingLog, getCapHit } from '../../utils/APIUtils';
import { RankStats, BasicStats, PlayerInfo} from '../../utils/types/Types';
import Card from '@mui/material/Card';
import { CardContent, Typography } from '@mui/material';

const PORTRAITS_URL = "https://nhl.bamcontent.com/images/headshots/current/168x168/";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

const PlayerCard = (props: IPlayerCardProps) => { 

  const [rankStats, setRankStats] = useState<RankStats>();
  const [basicStats, setBasicStats] = useState<BasicStats>();
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo>();

  const getRankStatsData = async () => {
      if (props.player){
        await getPlayerRankStats(props.player.id)
        .then( (res) => {
          console.log("rank stats: ", res);
          setRankStats(res);
        })
      }
  }

  const getBasicStatsData = async () => {
    if (props.player){
      await getPlayerBasicStats(props.player.id)
      .then( (res) => {
        console.log("basic stats: " , res);
        setBasicStats(res);
      })
    }
  }

  const getPlayerInfoData = async () => {
    if (props.player){
      await getPlayerInfo(props.player.id)
      .then( (res) => {
        console.log("player info: ", res);
        setPlayerInfo(res);
      })
    }
  }

  const getShootingEventData = async () => {
    if (props.player){
      await getShootingLog(props.player.id)
      .then( (res) => {
        console.log("shooting events: " , res);
      })
    }
  }

  const getCapHitData = async () => {
    if (props.player){
      await getCapHit(props.player.id)
      .then( (res) => {
        console.log("cap hit: " , res)
      })
    }
  }


  useEffect( () => {
      getRankStatsData();
      getBasicStatsData();
      getPlayerInfoData();
      getCapHitData();
      getShootingEventData();
  }, [props.player])

  return (
    <Card className="player-card" sx={{ minWidth: 275 }}>
        <CardContent>
        <img src={`${PORTRAITS_URL}${props.player.id}.jpg`}/>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        {props.player.name}
        {rankStats?.rankPoints}
        </Typography>
    </CardContent>
    </Card>
  );
}

export default PlayerCard;