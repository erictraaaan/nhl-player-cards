import React, { useEffect, useState } from 'react'
import { IPlayerCardProps } from './types/PlayerCard';
import { getPlayerRankStats, getPlayerBasicStats, getPlayerInfo, getShootingLog, getCapHit } from '../../utils/APIUtils';
import { RankStats, BasicStats, PlayerInfo, ShootingEvent} from '../../utils/types/Types';
import Card from '@mui/material/Card';
import { CardContent } from '@mui/material';
// import './PlayerCard.scss';
import ShotVisualizer from '../shotvisualizer/ShotVisualizer';
import RankBox from '../rankbox/RankBox';
import BasicStat from '../basicstat/BasicStat';
import { roundValue } from '../../utils/PlayerUtils';

const PORTRAITS_URL = "https://nhl.bamcontent.com/images/headshots/current/168x168/";
const IMG_SRC = "https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/";

const PlayerCard = (props: IPlayerCardProps) => { 

  const [rankStats, setRankStats] = useState<RankStats | null>(null);
  const [basicStats, setBasicStats] = useState<BasicStats | null>(null);
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo | null >(null);
  const [capHit, setCapHit] = useState<string | null>(null);
  const [shootingEvents, setShootingEvents] = useState<ShootingEvent[]| null>(null);

  const resetStates = () => {
    setRankStats(null);
    setBasicStats(null);
    setPlayerInfo(null);
    setCapHit(null);
    setShootingEvents(null);
  }
  
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
      resetStates();
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
            {playerInfo.primaryPosition.code != "G" ? (
              <>
              <BasicStat title="G" value={basicStats.goals}/>
              <BasicStat title="A" value={basicStats.assists}/>
              <BasicStat title="P" value={basicStats.points}/>
              <BasicStat title="TOI" value={basicStats.timeOnIcePerGame}/>
              </>
            ) : (
              <>
              <BasicStat title="Wins" value={basicStats.wins}/>
              <BasicStat title="SV%" value={roundValue(basicStats.savePercentage)}/>
              <BasicStat title="GAA" value={roundValue(basicStats.goalAgainstAverage)}/>
              <BasicStat title="SO" value={basicStats.shutouts}/>
              </>
            )}

          </div>
          </div>
          </>
          )}


        </div>

        {!!rankStats ? (
          <>
          <h4>League Performance Rankings</h4>
          <div className='rank-stats'>
            <div className='stats'>
              {playerInfo.primaryPosition.code != "G" ? (
                <>
                <RankBox title="Goal Scoring" rank={rankStats.rankGoals} totalPlayers={props.totalPlayers}/>
                <RankBox title="Assists" rank={rankStats.rankAssists} totalPlayers={props.totalPlayers}/>
                <RankBox title="Points" rank={rankStats.rankPoints} totalPlayers={props.totalPlayers}/>
                <RankBox title="Shots" rank={rankStats.rankShots} totalPlayers={props.totalPlayers}/>
                <RankBox title="Hits" rank={rankStats.rankHits} totalPlayers={props.totalPlayers}/>
                <RankBox title="Blocked Shots" rank={rankStats.rankBlockedShots} totalPlayers={props.totalPlayers}/>
                </>
              ): (
                <>
                <RankBox title="Wins" rank={rankStats.wins} totalPlayers={props.totalGoalies}/>
                <RankBox title="GAA" rank={rankStats.goalsAgainstAverage} totalPlayers={props.totalGoalies}/>
                <RankBox title="Shutouts" rank={rankStats.shutOuts} totalPlayers={props.totalGoalies}/>
                <RankBox title="Saves" rank={rankStats.saves} totalPlayers={props.totalGoalies}/>
                <RankBox title="Games Played" rank={rankStats.games} totalPlayers={props.totalGoalies}/>
                </>
              )}

            </div>
          </div>
        </>
        ): (
        <div className='loading-wrapper'>
          <div className='loader'></div>
          <p>loading ranked data...</p>
        </div>
        )}

        {playerInfo.primaryPosition.code != "G" && (
          <>
          {!!shootingEvents ? (
            <>
            <h4>Shooting Log</h4>
            <div className='shot-log-wrapper'>

              <ShotVisualizer events={shootingEvents}/>
              <div className='info-text'>
                <p>Distribution of shots taken by this player over the past 20 games.</p>
                <p><b>Large circles</b> represent shooting distribution over the set of games.</p>
                <p><b>Small circles</b> indicate goals scored during this time period.</p>
              </div>
            </div>
            </>
          ) : (
            <div className='loading-wrapper'>
              <div className='loader'></div>
              <p>loading shooting data...</p>
            </div>
          )}
          </>
        )}
      </CardContent>
    </Card>
    )}
  </>
  );
}

export default PlayerCard;