import React, {Component} from 'react';

class LeagueForm extends Component {
  render() {
    return (
      <form
        action=""
        className="league-form"
        onSubmit={this.props.handleSubmit}>
        <select
          name="league"
          id="league"
          className="league-select"
          placeholder="Please select a league"
          value={this.props.league}
          onChange={this.props.handleChange}>
          <option value="mlb">Major League Baseball</option>
          <option value="nhl">National Hockey League</option>
          <option value="nfl">National Football League</option>
          <option value="nba">National Basketball Association</option>
        </select>
        <input
          type="submit"
          value="Go!"
          className="league-submit" />
      </form>
    )
  }
}

export default LeagueForm;