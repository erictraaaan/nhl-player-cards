from flask import Flask, jsonify, request
from flask_cors import CORS
from nhlapi import *

app = Flask(__name__)
CORS(app) # This will enable CORS for all routes

@app.route("/players/<player_id>")
def player(player_id):
    '''Returns player bio information (name, birthdate, birthplace, current team...)
    See https://gitlab.com/dword4/nhlapi/-/blob/master/stats-api.md#people for more info'''
    res = get_player(player_id, params=request.args)
    return jsonify(res)

@app.route("/players/<player_id>/stats")
def playerstats(player_id):
    '''Returns player stat-splits.  
    @param "stats": determines stat splits in response (defaults to "statsSingleSeason")
    See https://gitlab.com/dword4/nhlapi/-/blob/master/stats-api.md#people for more info'''
    params = dict(stats='statsSingleSeason')
    params.update(request.args)
    res = get_player_stats(player_id, params=params)
    return jsonify(res)

@app.route("/teams")
def teams():
    '''Returns list of NHL teams
    See https://gitlab.com/dword4/nhlapi/-/blob/master/stats-api.md#teams for more info''' 
    res = get_teams(params=request.args)
    return jsonify(res)

@app.route("/teams/<team_id>")
def team(team_id):
    '''Returns NHL team 
    See https://gitlab.com/dword4/nhlapi/-/blob/master/stats-api.md#teams for more info''' 
    res = get_team(team_id, params=request.args)
    return jsonify(res)

@app.route("/teams/<team_id>/stats")
def teamstats(team_id):
    '''Returns NHL team stats
    See https://gitlab.com/dword4/nhlapi/-/blob/master/stats-api.md#teams for more info''' 
    res = get_team_stats(team_id, params=request.args)
    return jsonify(res)

@app.route("/schedule")
def schedule():
    '''Returns NHL schedule.  Defaults to today's games
    Accepts params:
        - "startDate", "endDate" (must supply both)
        - "teamId"
        - "expand" e.g. "expand=schedule.linescore"
    See https://gitlab.com/dword4/nhlapi/-/blob/master/stats-api.md#schedule for more info''' 
    res = get_schedule(params=request.args)
    return jsonify(res)

@app.route("/game/<game_pk>")
def game(game_pk):
    '''Returns game information 
    See https://gitlab.com/dword4/nhlapi/-/blob/master/stats-api.md#games for more info'''
    res = get_game(game_pk, params=request.args)
    return jsonify(res)
