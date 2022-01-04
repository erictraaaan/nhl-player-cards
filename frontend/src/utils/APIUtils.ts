import axios from "axios";
import { Team, Player, RankStats, BasePlayer, BasicStats, PlayerInfo, ShootingEvent } from "./types/Types";

const IMG_SRC = "https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/";

const FLASK_SERVER_URL = "http://127.0.0.1:5000"

export const getPlayers = async (): Promise<BasePlayer[]> => {
    return new Promise( (resolve, reject) => {
        const apiCall = `${FLASK_SERVER_URL}/players`;
        axios.get(apiCall)
        .then( (json) => {
            var output: BasePlayer[] = [];
            if (json.data && json.data.length > 1){
                json.data.forEach( (player: BasePlayer) => {
                    output.push(player);
                })
            }
            return resolve(output);
        })
        .catch( () => {
            return reject(null);
        })
    })
}


export const getTeams  = async (): Promise<Team[]>  => {
    return new Promise( (resolve, reject) => {
        const apiCall = `${FLASK_SERVER_URL}/teams`;
        axios.get(apiCall)
        .then( (json) => {
            var output: Team[] = [];
            if (json.data && json.data.length > 1){
                json.data.forEach( (team: any) => {
                    var name = team.name;
                    var id = team.id;
                    var logo = `${IMG_SRC}${id}.svg`;
                    var teamObj: Team = {
                        name: name,
                        id: id,
                        logo: logo
                    }
                    output.push(teamObj)
                })
                return resolve(output);
            }
        })
        .catch( () => {
            return reject(null);
        })
    })
}

export const getDepth = async (teamID: number): Promise<Player[]> => {
    return new Promise( (resolve, reject) => {
        const apiCall = `${FLASK_SERVER_URL}/depth/${teamID}`;
        axios.get(apiCall)
        .then( (json) => {
            var output: Player[] = [];
            if (json.data && json.data.length > 1){
                json.data.forEach( (player: any) => {
                    var playerObj: Player = {
                        id: player.ID,
                        name: player.PLAYER,
                        jerseyNumber: player['#'],
                        plusMinus: player['+/-'],
                        goals: player.G,
                        assists: player.A,
                        age: player.AGE,
                        capHit: player['CAP HIT'],
                        gaa: player.GAA,
                        gp: player.GP,
                        height: player.HT,
                        points: player.P,
                        pointsPerGame: player['P/GP'],
                        pos: player.POS,
                        sh: player.SH,
                        savePercentage: player['SV%'],
                        status: player.STATUS,
                        toi: player.TOI,
                        winLoss: player['W-L'],
                        weight: player.WT
                    
                    }
                    output.push(playerObj);
                });
                return resolve(output);
            }
        })
        .catch( () => {
            return reject(null);
        })
    })   
}

export const getPlayerRankStats = (playerID: number): Promise<RankStats> => {
    return new Promise( (resolve, reject) => {
        const apiCall = `${FLASK_SERVER_URL}/players/${playerID}/stats?stats=regularSeasonStatRankings`;
        axios.get(apiCall)
        .then( (json) => {
            if (json.data && json.data.length === 1){
                var stats: RankStats = json.data[0].splits[0].stat;
                stats.id = playerID;
                return resolve(stats);
            }
        })
        .catch( () => {
            return reject(null);
        })
    })   
}

export const getPlayerBasicStats = (playerID: number): Promise<BasicStats> => {
    return new Promise( (resolve, reject) => {
        const apiCall = `${FLASK_SERVER_URL}/players/${playerID}/stats`;
        axios.get(apiCall)
        .then( (json) => {
            if (json.data && json.data.length === 1){
                var stats: BasicStats = json.data[0].splits[0].stat;
                stats.id = playerID;
                return resolve(stats);
            }
        })
        .catch( () => {
            return reject(null);
        })
    }) 
}

export const getPlayerInfo = (playerID: number): Promise<PlayerInfo> => {
    return new Promise( (resolve, reject) => {
        const apiCall = `${FLASK_SERVER_URL}/players/${playerID}`;
        axios.get(apiCall)
        .then( (json) => {
            if (json.data){
                var data: PlayerInfo = json.data;
                return resolve(data);
            }
        })
        .catch( () => {
            return reject(null);
        })
    }) 
}

export const getShootingLog = (playerID: number): Promise<ShootingEvent[]> => {
    return new Promise( (resolve, reject) => {
        const apiCall = `${FLASK_SERVER_URL}/shotlog/${playerID}`;
        axios.get(apiCall)
        .then( (json) => {
            var output: ShootingEvent[] = [];
            if (json.data && json.data.length > 0){
                json.data.forEach( (shot: ShootingEvent) => {
                    output.push(shot);
                })
            }
            return resolve(output);
        })
        .catch( () => {
            return reject(null);
        })
    })
}

export const getCapHit = (playerID: number ): Promise<string> => {
    return new Promise( (resolve, reject) => {
        const apiCall = `http://127.0.0.1:5000/caphit/${playerID}`;
        axios.get(apiCall)
        .then( (json) => {
            if (json.data) {
                var output = json.data.caphit;
                return resolve(output);
            }
        })
        .catch( () => {
            return reject(null);
        })
    })
}



export default {getTeams}