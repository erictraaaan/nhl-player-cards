export interface Team {
    name: string
    id: number
    logo: string
}

export interface BasePlayer {
    id: number
    name: string
    teamcode: string
    teamid: number
    position: string
}

export interface ShootingEvent {
    event: string,
    x: number,
    y: number
}

export interface BasicStats {
    id: number,
    goals:number,
    assists: number,
    blocked: number,
    faceOffPct: number,
    games: number,
    hits: number,
    points: number,
    timeOnIcePerGame: string
    gamesStarted: number,
    goalAgainstAverage: number,
    savePercentage: number,
    shutouts: number,
    wins: number

}

export interface PlayerInfo {
    id: number,
    birthCity: string,
    birthStateProvince: string,
    birthCountry: string,
    height: string,
    weight: number,
    primaryNumber: number,
    primaryPosition: Position,
    currentTeam: CurrentTeam,
    currentAge: number
}

export interface Position{
    abbreviation: string,
    code: string,
    name: string,
    type: string
}

export interface CurrentTeam {
    id: number,
    name: string
}

export interface Player{
    id: number
    name: string
    jerseyNumber: number
    plusMinus: number
    goals: number
    assists: number
    age: number
    capHit: string
    gaa: number
    gp: number
    height: string
    points: number
    pointsPerGame: number
    pos: string
    sh: string
    savePercentage: string
    status: string
    toi: string
    winLoss: string
    weight: number
}

export interface RankStats {
    id: number
    rankAssists: string,
    rankBlockedShots: string,
    rankGamesPlayed: string,
    rankGoals: string,
    rankHits: string,
    rankOvertimeGoals: string,
    rankPenaltyMinutes: string,
    rankPlusMinus: string,
    rankPoints: string,
    rankPowerPlayGoals: string,
    rankShortHandedGoals: string,
    rankShotPct: string,
    rankShots: string

    // goalie stats
    games: string,
    goalsAgainst: string,
    goalsAgainstAverage: string,
    losses: string,
    ot: string,
    penaltyMinutes: string,
    savePercentage: string,
    saves: string,
    shotsAgainst: string,
    shutOuts: string,
    timeOnIce: string,
    wins: string

}