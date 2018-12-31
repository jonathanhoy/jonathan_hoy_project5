import React, { Component } from 'react';
import firebase from './firebase';
import { BrowserRouter as Router, Route, NavLink, Redirect } from 'react-router-dom';
import './styles/styles.scss';

import DisplayLeagues from './DisplayLeagues';
import DisplayFavoriteTeams from './DisplayFavoriteTeams';
import DisplaySchedules from './DisplaySchedules';


const moment = require('moment');
moment().format();
const currentDate = moment().format('dddd MMMM D, YYYY');

const provider = new firebase.auth.GoogleAuthProvider();
const auth = firebase.auth();

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      favoriteTeams: {},
    }
  }
  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          user: user
        }, () => {
          this.userRef = firebase.database().ref(`/${this.state.user.uid}`);
          this.userRef.on('value', (snapshot) => {
            this.setState({
              favoriteTeams: snapshot.val()
            })
          })
        });
      }
    });
  }
  loginGoogle = () => {
    auth.signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        this.setState({
          user: user
        });
      });
  }
  logout = () => {
    auth.signOut()
      .then(() => {
        this.setState({
          user: null
        });
      });
  }
  render() {
    return (
      <Router>
        <div className="App">
          <div>
            <header className="header">
              <div className="wrapper">
                <h1 className="header__title">Sport Schedules</h1>
                <p className="header__date">{currentDate}</p>
                <nav className="nav">
                  <NavLink to="/schedules" className="nav__link" activeClassName="active">Schedules</NavLink>
                  <NavLink to="/my-teams" className="nav__link" activeClassName="active">My Teams</NavLink>
                  <NavLink to="/leagues" className="nav__link" activeClassName="active">Leagues</NavLink>
                  {
                    this.state.user &&
                    <button onClick={this.logout} className="nav__log-in-out">Log Out</button>
                  }
                </nav>
              </div>
            </header>
            <main>
            </main>
            {
              this.state.user
              ?
              (
                <main className="main main--logged-in">
                  <div className="wrapper">
                      <Route exact path='/' render={() => <Redirect to='/schedules' /> } />
                      <Route path="/schedules" render={(props) => <DisplaySchedules {...props} favoriteTeams={this.state.favoriteTeams} user={this.state.user} /> } />
                      <Route path="/my-teams" render={(props) => <DisplayFavoriteTeams {...props} favoriteTeams={this.state.favoriteTeams} user={this.state.user} /> } />
                      <Route path="/leagues" render={(props) => <DisplayLeagues {...props} favoriteTeams={this.state.favoriteTeams} user={this.state.user} /> } />
                  </div>
                </main>
              )
              :
              (
                <main className="main main--logged-out">
                  <div className="wrapper">
                    <h2 className="section-title">You must be logged in.</h2>
                    <div className="main__log-in-out-button-container">
                      <button onClick={this.loginGoogle} className="log-in">Log in with Google</button>
                    </div>
                  </div>
                </main>
              )
            }
          </div>
          <footer className="footer">
            <div className="wrapper">
              <p>&copy; Jonathan 2018 | <a href="https://jonathanhoy.com/" className="portfolio-link">Back to Portfolio</a></p>
              <p>API information courtesy of <a href="https://www.thesportsdb.com/api.php">TheSportsDB</a></p>
            </div>
          </footer>
        </div>
      </Router>
    );
  }
}

export default App;