import pandas as pd
import numpy as np
from nhlapi import *
import requests
import json
from bs4 import BeautifulSoup
import unidecode


def cap_friendly_request(url):
    res = requests.get(url)
    if res.status_code == 200:
        return res
    try:
        abort(res.status_code, res.json()['message'])
    except:
        abort(res.status_code, 'CapFriendly Scraper Error')

def get_cap_hit(player_id):
    player_data = get_player(player_id)
    full_name = player_data['fullName'].replace(" ","-").lower()
    
    # decode string to handle accents and special characters
    full_name = unidecode.unidecode(full_name)

    team_name = player_data['currentTeam']['name']
    page = requests.get("https://www.capfriendly.com/players/{}".format(full_name))

    soup = BeautifulSoup(page.content, 'html.parser')
    h3s = soup.find_all('h3', {'class':['c']})
    if len(h3s) == 1:
        team_name_h3 = h3s[0].text
        counter = 1
        while (team_name != team_name_h3):
            full_name = full_name + str(counter)
            counter = counter+ 1
            page = requests.get("https://www.capfriendly.com/players/{}".format(full_name))
            soup = BeautifulSoup(page.content, 'html.parser')
            h3s = soup.find_all('h3', {'class':['c']})
            if (len(h3s) == 1):
                team_name_h3 = h3s[0].text

    cap_hit_string = "";
    divs = soup.find_all('div', {'class':['c']})
    for div in divs:
        text = div.text
        if ("Cap Hit: " in text and "Daily" not in text):
            cap_hit_string = text
            break    
    cap_hit_string = cap_hit_string.split(":")[1].strip()
    output = {
        "caphit" : cap_hit_string
    }
    return output


def get_depth(team_id):
    data = get_team(team_id,"expand=team.roster")
    teamName = data['teamName'].lower().replace(" ","")

    player_data = []
    for player in data["roster"]["roster"]:
        fullName = player['person']['fullName']
        player_id = player['person']['id']
        split = fullName.split()[::-1]
        name = ""
        for i in range(len(split)):
            name = name + split[i] + ", "
        name = name[:-2]
        array = [name, player_id]
        player_data.append(array)

    numpy_data = np.array(player_data)
    df_ids = pd.DataFrame(data=numpy_data, columns=["PLAYER", "ID"])

    url = "https://www.capfriendly.com/depth-charts/" + teamName

    r = cap_friendly_request(url)

    df_list = pd.read_html(r.text, header=[0]) # this parses all the tables in webpages to a list

    df_main = df_list[0]
    if (df_main.shape[0] > 1):
        df_main = df_main.iloc[0:0]

    df_main = df_main.rename(columns={df_main.columns[2]: 'PLAYER', df_main.columns[3]: 'STATUS'})

    for i in range(len(df_list)):
        if (i <= 7): #ensures we only get the players that are on the NHL team
            df = df_list[i]
            if df.shape[0] > 1:
                df = df.iloc[1: , :]
                og_col_name = df.columns[2]
                df.dropna(subset=['POS'], inplace=True)
                df = df.rename(columns={df.columns[2]: 'PLAYER',df_main.columns[3]: 'STATUS'})
                df['STATUS'] = og_col_name
                df_main = df_main.append(df)

    output = df_main[["POS", "#","PLAYER","STATUS","AGE","SH","HT","WT","CAP HIT","GP","G","A","P","P/GP","TOI","+/-","GAA","SV%","W-L"]]
    output = output.merge(df_ids, on='PLAYER')
    result = output.to_json(orient='records')
    parsed = json.loads(result)
    return parsed
