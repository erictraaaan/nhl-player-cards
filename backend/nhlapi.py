'''This file contains helpful functions for querying the NHL's 
publicly accessible API.  This list of endpoints is by no means exhaustive.
'''
import requests
import pandas as pd
import numpy as np
import json
from datetime import datetime
from flask import abort

nhl_url = 'https://statsapi.web.nhl.com/api/v1/'

def nhl_request(path, **kwargs):
    res = requests.get(nhl_url+path, **kwargs)
    if res.status_code == 200:
        return res.json()
    try:
        abort(res.status_code, res.json()['message'])
    except:
        abort(res.status_code, 'NHL API Error')

def get_player(player_id, params={}):
    response = nhl_request(f'people/{player_id}', params=params)
    return response['people'][0]

def get_player_stats(player_id, params={}):
    response = nhl_request(f'people/{player_id}/stats', params=params)
    return response['stats']

def get_teams(params={}):
    response = nhl_request('teams', params=params)
    return response['teams']

def get_team(team_id, params={}):
    response = nhl_request(f'teams/{team_id}', params=params)
    return response['teams'][0]

def get_team_stats(team_id, params={}):
    response = nhl_request(f'teams/{team_id}/stats', params=params)
    return response['stats']

def get_schedule(params={}):
    response = nhl_request('schedule', params=params)
    return response

def get_game(game_pk, params={}):
    response = nhl_request(f'game/{game_pk}/feed/live', params=params)
    return response['gameData']

def get_game_plays(game_pk, params={}):
    response = nhl_request(f'game/{game_pk}/feed/live', params=params)
    return response['liveData']

def get_players():
    dateTimeObj = datetime.now()
    currentTimeStamp = dateTimeObj.strftime("%Y-%m-%d")
    try:
        df = pd.read_csv('./player_data/players_' + currentTimeStamp + '.csv')
        result = df.to_json(orient='records')
        parsed = json.loads(result)
        return parsed
    except:
        data = get_teams()
        teams=[]
        team_codes = []
        for team in data:
            teams.append(team['id'])
            team_codes.append(team['abbreviation'])

        player_list = []
        for i in range(len(teams)):
            team = teams[i]
            team_code = team_codes[i]
            player_data = get_team(team,"expand=team.roster")
            
            for player in player_data["roster"]["roster"]:
                fullName = player['person']['fullName']
                player_id = player['person']['id']
                pos = player['position']['code']
                array = [fullName, player_id, team_code, team, pos]
                player_list.append(array)

        numpy_data = np.array(player_list)
        df_ids = pd.DataFrame(data=numpy_data, columns=["name", "id","teamcode", "teamid", "position"])
        df_ids[['first_name','last_name']] = df_ids['name'].loc[df_ids['name'].str.split().str.len() == 2].str.split(expand=True)
        df_ids = df_ids.sort_values(by='last_name').reset_index()
        df_ids = df_ids[['name','id','teamcode','teamid', "position"]]
        df_ids.to_csv('./player_data/players_' + currentTimeStamp + '.csv', index=False)
        result = df_ids.to_json(orient='records')
        parsed = json.loads(result)
        return parsed

def get_shot_log(player_id):
    gamelog_res = get_player_stats(player_id, "stats=gameLog")

    # convert player_id to an int
    player_id = int(player_id)

    gamePks = []
    count = 0 
    for split in  gamelog_res[0]['splits']:
        gamePks.append(split['game']['gamePk'])
        count = count + 1
        if count >= 10:
            break
    shootingLogEventTypes = ["SHOT", "GOAL"]
    playerTypes = ["Shooter", "Scorer"]
    shotlog_entries = []
    for gamePk in gamePks:
        live_data = get_game_plays(gamePk, {})
        all_plays = live_data['plays']['allPlays']

        for play in all_plays:
            if play['result']['eventTypeId'] in shootingLogEventTypes:
                for player in play['players']:
                    if player['player']['id'] == player_id and player['playerType'] in playerTypes:
                        x = play['coordinates']['x']
                        y = play['coordinates']['y']
                        period = play['about']['period']
                        if period % 2 == 0: #flip coordinates for the second period
                            x = -x
                            y = -y
                        shotlog_entry = {
                            "event": play['result']['eventTypeId'] ,
                            "x" : x ,
                            "y" : y
                        }
                        shotlog_entries.append(shotlog_entry)

    for entry in shotlog_entries: # flip all coordinates with negative x value
        if entry['x'] < 0:
            entry['x'] = -entry['x']
            entry['y'] = -entry['y']

    return shotlog_entries