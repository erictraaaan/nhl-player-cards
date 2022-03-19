
# NHL Player Cards
This application displays Player Cards for NHL players.   Use it to quickly view stats and evaluate player performance at a glance.
![demo](https://raw.githubusercontent.com/erictraaaan/developer_hw/main/img/demo.gif)
## Setup Steps
*Note: In order to ensure compatibility, I would greatly appreciate if you create a python virtual environment to run the backend of this application.  Please follow the steps below to set this up.  Thank you!*
1. Start by cloning the repository with ```git clone https://github.com/erictraaaan/developer_hw.git```
2. Navigate to the backend folder: ```cd backend``` 
3. Create the Python virtual environment with ```python3 -m venv .venv```
4. Start the virtual environment using ```source .venv/bin/activate``` (MacOS) or ```.venv\Scripts\activate.bat``` on Windows.
5. Ensure that you are running in the virtual environment.  Your terminal command line should be prefaced with something like this: ``` (.venv) erictran@Erics-MacBook-Pro backend %```
6. Install the necessary python packages with ```pip install -r requirements.txt```
7. Start the Flask server with ```flask run```
8. Ensure that the Flask server is running on ```127.0.0.1:5000```. 
	* If your Flask server isn't on this port, please change the value of ```FLASK_SERVER_URL``` on line 6 of ```frontend/src/utils/APIUtils.ts``` to reflect your Flask server port.
9. Next, we will set up the frontend.  In a separate terminal, navigate to the ```frontend``` folder
10. Run ```npm install``` to install all the necessary packages for the React app.
11. Run ```npm start``` to start the application on ```http://localhost:3000/```
12. You're done!

*Note: Anytime you start up the backend of the application, please ensure that you are using the virtual Python environment.  This can be easily activated by running the ```source .venv/bin/activate``` command from within the ```backend``` folder.*

## Overview & Feature Walkthrough
A sample player card is shown below.  Each card contains three sections:
1. Basic Information
2. League Performance Rankings
3. (Skaters only) Shooting Log

Each section is described in more detail below.

![screenshot](https://raw.githubusercontent.com/erictraaaan/developer_hw/main/img/screenshot.png)
### Basic Information
This section displays basic information such as:
* Player name, team, position, etc.
* Player cap hit value
	* *Note: This value is obtained by scraping the CapFriendly website.  However, CapFriendly prohibits data scraping from their site in their terms of service.  As such, this application should  be used for **demonstration purposes only**.  In order to deploy this feature in a production setting, other (paid) APIs can be used to acquire this data such as those available from [Spotrac](https://www.spotrac.com/developer/api/) or [DailyFaceoff](https://www.dailyfaceoff.com/nhl-hockey-apis/).*
* Simple performance stats such as goals, assists, points, average time-on-ice (skaters) and wins, save percentage, goals against average (goalies) for the current season.
### League Performance Rankings
When determining player performance, one of the most important aspects to evaluate is their play compared to their peers. This section highlights how a player performs in various metrics such as goals, assists, shots, etc. in relation to other players in the NHL.  For each metric, the box is colour coded to quickly distinguish key high-performing elements of the player's game.  For goalie player cards, metrics such as Wins, GAA, SV%, etc. are used.
### Shooting Log
This section shows the player's shooting locations over their past 20 games.  A heat map is created to highlight key areas where the player takes the most shots.  Additionally, shots that resulted in a goal over the player's previous 20 games are also displayed.


## Next Steps and Areas for Improvement
The open-ended nature of this project leaves a lot of potential for further improvements.  Had we have been given more time, there are multiple improvements that I would like to make, such as:
* **Advanced stats and breakdowns**
	* Given the detail of the NHL API, it is possible to calculate many advanced statistics such as Corsi, Fenwick, and PDO.  Additionally, assigning value to shots based on shot location (using methods such as [War-On-Ice's 'scoring chances'](http://blog.war-on-ice.com/new-defining-scoring-chances/index.html)) and weighing that in when evaluating shooting can help determine true scoring talent.
* **More defensive statistics**
	* Most of the stats and data presented in the player card tends to favour offensive players.  As a next step, I would like to include metrics such as zone exits, breakout passes, and defensive zone takeaways to help better evaluate all types of players.
* **Team depth charts**
	* Inspired by [DailyFaceoff](https://www.dailyfaceoff.com/teams/boston-bruins/line-combinations/), it would be great if the player card could display the player's position within their team's depth chart.  This could help both visualize the player's impact on the team, as well as potentially answer whether a player is performing poorly, or perhaps just isn't being given enough opportunities to succeed.
* **Improve backend "caching" implementation**
	* In order to optimize the performance of the application, a static list of all players is kept in the backend in a ```.csv``` file.  This file is updated daily in order to ensure the most up to date NHL rosters are captured within the application.  With more time, my next step would be to implement this data storage in a more efficient manner, such as through a database such a MongoDB or SQLite.
* **Deploy App on Cloud Service (AWS)**
	* In order to allow users to use this application without having to install anything locally, it makes sense to deploy the app on a cloud service such as AWS. This can be done through leveraging technologies such as API Gateway, Lambda, and DynamoDB to handle the python backend and eventual database, and AWS Amplify or S3 to host the front-end.
* **Fix Edge-Cases**
	* There are currently certain edge cases that do not display data as intended on the application.  For example:
		* Selecting *Carey Price* from the player list results in a broken card, as he does not have any data available (having not played a game yet this season)
		* Selecting *Mikey Anderson* results in a card that does not display cap hit data.  This is because this player, while known as *'Mikey Anderson'* on the NHL database, is actually known as *'Michael Anderson'* on CapFriendly.  This ends up breaking the CapFriendly scraper.
* **Limitations on scraping the CapFriendly website**
	* As mentioned above, scraping the CapFriendly website is against the site's terms of service.  Additionally, since CapFriendly does not use player ID values in their URLs for player specific pages, it is difficult to accurately acquire information through scraping.  With more time, I would certainly explore better approaches to acquiring player salary information.

## Data Sources
* [NHL API](https://gitlab.com/dword4/nhlapi)
* [CapFriendly](https://www.capfriendly.com/) for salary information

## External Software Packages Used
This project is made with the help of the following software packages:
### Backend
* [Pandas](https://pandas.pydata.org/) - Used for data manipulation
* [BeautifulSoup](https://pypi.org/project/beautifulsoup4/) - Used for web scraping
### Frontend
* [React](https://reactjs.org/) - Front end framework for creating UIs
* [Material UI](https://mui.com/) - Front end framework containing pre-styled UI components
* [Axios](https://github.com/axios/axios) - Promise based HTTP Client for API request handling
* [D3](https://d3js.org/) - Data visualization 
