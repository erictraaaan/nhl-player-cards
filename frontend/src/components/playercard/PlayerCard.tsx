import React, { useEffect, useState } from 'react'
import Modal from '@mui/material/Modal';
import { IPlayerCardProps } from './types/PlayerCard';
import Box from '@mui/material/Box';
import { getPlayerRankStats, getPlayerBasicStats, getPlayerInfo, getShootingLog, getCapHit } from '../../utils/APIUtils';
import { RankStats, BasicStats, PlayerInfo, ShootingEvent} from '../../utils/types/Types';
import Card from '@mui/material/Card';
import { CardContent, Typography } from '@mui/material';
import './PlayerCard.scss';
import ShotVisualizer from '../shotvisualizer/ShotVisualizer';
import RankBox from '../rankbox/RankBox';
import BasicStat from '../basicstat/BasicStat';

const PORTRAITS_URL = "https://nhl.bamcontent.com/images/headshots/current/168x168/";
const IMG_SRC = "https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/";

const PlayerCard = (props: IPlayerCardProps) => { 

  const [rankStats, setRankStats] = useState<RankStats>();
  const [basicStats, setBasicStats] = useState<BasicStats>();
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo>();
  const [capHit, setCapHit] = useState<string>();
  const [shootingEvents, setShootingEvents] = useState<ShootingEvent[]>();
  
  const getRankStatsData = async () => {
      if (props.player){
        await getPlayerRankStats(props.player.id)
        .then( (res) => {
          setRankStats(res);
        })
      }
  }

  const getBasicStatsData = async () => {
    if (props.player){
      await getPlayerBasicStats(props.player.id)
      .then( (res) => {
        setBasicStats(res);
      })
    }
  }

  const getPlayerInfoData = async () => {
    if (props.player){
      await getPlayerInfo(props.player.id)
      .then( (res) => {
        setPlayerInfo(res);
      })
    }
  }

  const getShootingEventData = async () => {
    if (props.player){
      await getShootingLog(props.player.id)
      .then( (res) => {
        setShootingEvents(res);
      })
    }
  }

  const getCapHitData = async () => {
    if (props.player){
      await getCapHit(props.player.id)
      .then( (res) => {
        setCapHit(res);
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
    <>
    {!!playerInfo && (
      <Card className="player-card">
        <CardContent className='card-content'>
          <div className="header">
            <h2 className='name'>{props.player.name} #{playerInfo.primaryNumber}</h2>
            <div className='team-logo'>
              <img className='logo' src={`${IMG_SRC}${props.player.teamid}.svg`}/>
            </div>
            <h4 className='position'>{playerInfo.primaryPosition.name}, {playerInfo.currentTeam.name}</h4>
          </div>
        <div className='info'>
          <img className='portrait' src={`${PORTRAITS_URL}${props.player.id}.jpg`}/>
          <div className='basic-info'>
            <p className='age'>Age: {playerInfo.currentAge}</p>
            <p className='height'>Height: {playerInfo.height}</p>
            <p className='weight'>Weight: {playerInfo.weight}lbs</p>
            <p className='caphit'>Cap Hit: {capHit}</p>
          </div>
          {!!basicStats && (
            <>
          <div className="basic-stat-wrapper">
          <h4>Current Season Performance:</h4>

          <div className='basic-stats'>

            <BasicStat title="G" value={basicStats.goals}/>
            <BasicStat title="A" value={basicStats.assists}/>
            <BasicStat title="P" value={basicStats.points}/>
            <BasicStat title="TOI" value={basicStats.timeOnIcePerGame}/>
          </div>
          </div>
          </>
          )}


        </div>

        {!!rankStats && (
          <>
          <h4>League Performance Rankings</h4>
          <div className='rank-stats'>
            <div className='stats'>
              <RankBox title="Goal Scoring" rank={rankStats.rankGoals} />
              <RankBox title="Assists" rank={rankStats.rankAssists} />
              <RankBox title="Points" rank={rankStats.rankPoints} />
              <RankBox title="Shots" rank={rankStats.rankShots} />
              <RankBox title="Hits" rank={rankStats.rankHits} />
              <RankBox title="Blocked Shots" rank={rankStats.rankBlockedShots} />
            </div>
          </div>
        </>
        )}

        {!!shootingEvents && (
          <>
          <h4>Shooting Log</h4>
          <ShotVisualizer events={shootingEvents}/>
          <p>Distribution of shots taken by this player over the past 20 games.</p>
          </>
        )}
      </CardContent>
    </Card>
    )}
  </>
  );
}

export default PlayerCard;