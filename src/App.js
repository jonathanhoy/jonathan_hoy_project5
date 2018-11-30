import React, { Component } from 'react';
import Axios from 'axios';
import firebase from './firebase';


// class-based/simple functional components
import LeagueForm from './LeagueForm';
import TeamsInLeague from './TeamsInLeague';
import DisplayFavoriteTeams from './DisplayFavoriteTeams';
import Schedule from './Schedule'


// reference to the root of the firebase database
const dbRef = firebase.database().ref();

class App extends Component {
  constructor() {
    super();
    this.state = {
      league: 'nhl', // default league
      teamsByLeague: [],
      favoriteTeams: {},
      currentView: 'schedule',
      // the folllowing are for pushing favorite team info to firebase
      teamBadge: '',
      teamID: 0,
      teamLeague: '',
      teamName: '',
      teamSchedule: {}
    }
  }
  componentDidMount() {
    dbRef.on('value', (snapshot) => {
      this.setState({
        favoriteTeams: snapshot.val()
      })
    });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.fetchLeague();
  }
  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }
  fetchLeague = () => {
    Axios.get(`https://www.thesportsdb.com/api/v1/json/1/search_all_teams.php?l=${this.state.league}`, {
    }).then((res) => {
      this.setState({
        teamsByLeague: res.data.teams
      })
    })
  }
  fetchTeamSchedule = (e) => {
    e.preventDefault();
    const getTeamBadge = e.target.getAttribute('data-team-badge');
    const getTeamID = e.target.id;
    const getTeamLeague = e.target.value;
    const getTeamName = e.target.getAttribute('data-team-name');
    this.setState({
      teamBadge: getTeamBadge,
      teamID: getTeamID,
      teamLeague: getTeamLeague,
      teamName: getTeamName,
    })
    Axios.get(`https://www.thesportsdb.com/api/v1/json/1/eventsnext.php?id=${e.target.id}`, {
    }).then((res) => {
      const upcomingGames = res.data.events.map((game) => {
        console.log(game)
        // working return
        // return game.strFilename;
        // testing return
        return `Date: ${game.dateEvent} | ${game.strEvent}`
      })
      this.setState({
        teamSchedule: upcomingGames  
      })
      const userSelectedTeam = {
        teamBadge: this.state.teamBadge,
        teamID: this.state.teamID,
        teamLeague: this.state.teamLeague,
        teamName: this.state.teamName,
        teamSchedule: this.state.teamSchedule
      }
      // console.log(userSelectedTeam);
      dbRef.push(userSelectedTeam);
    })
  }
  removeTeam = (e) => {
    const firebaseKey = e.target.id;
    const teamRef = firebase.database().ref(`/${firebaseKey}`);
    teamRef.remove();
  }
  showFavoriteTeams = () => {
    this.setState({
      currentView: 'favoriteTeams'
    })
  }
  showSchedule = () => {
    this.setState({
      currentView: 'schedule'
    })
  }
  showLeague = () => {
    this.setState({
      currentView: 'league'
    })
  }
  render() {
    return (
      <div className="App">
        <header>
          <div className="wrapper">
            <h1>Fan Feed</h1>
            <div>
              <button onClick={this.showSchedule}>Schedules</button>
              <button onClick={this.showFavoriteTeams}>My Teams</button>
              <button onClick={this.showLeague}>Leagues</button>
            </div>
          </div>
        </header>
        <main>
          <div className="wrapper">
              {
                this.state.currentView === 'schedule'
                ?
                <Schedule favoriteTeams={this.state.favoriteTeams}/>
                :
                null
              }
              {
                this.state.currentView === 'favoriteTeams'
                  ?
                  <DisplayFavoriteTeams
                    favoriteTeams={this.state.favoriteTeams}
                    removeTeam={this.removeTeam}
                    showLeague={this.showLeague} />
                  :
                  null
              }
              {
                this.state.currentView === 'league'
                ?
                <div>
                  <LeagueForm
                    handleSubmit={this.handleSubmit}
                    handleChange={this.handleChange}
                    league={this.state.league}
                    teams={this.state.teamsByLeague} />
                  <TeamsInLeague
                    teams={this.state.teamsByLeague}
                    captureTeam={this.captureTeam}
                    fetchTeamSchedule={this.fetchTeamSchedule} />
                </div>
                :
                null
              }
          </div>
        </main>
      </div>
    );
  }
}

export default App;
