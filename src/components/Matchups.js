import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom'
import dateFormat from 'dateformat'

@inject('store')
@inject('client')
@observer
class Matchups extends Component {

  constructor(props) {
    super(props)

    this.state = {
      matchups: [],
      my_rank: null,
      event: "daily",
      eventName: "Daily Dominance",
      offset: 0,
    }

    this.refresh = this.refresh.bind(this)
    this.onChange = this.onChange.bind(this)

    this.refresh()
  }

  onChange(e) {
    e.preventDefault()
    this.setState({
      offset: e.target.value
    }, () => {
      this.refresh()
    })
  }

  refresh() {
    this.props.client.matchupTop(this.state.event, this.state.offset)
      .then((response) => {
        const new_matchups = response.data
        this.props.client.matchupMe(this.state.event, this.state.offset)
          .then((response) => {
            this.setState({
              matchups: new_matchups,
              my_rank: response.data,
            })
          })
          .catch((error) => {
            this.props.client.handleError(error, "Failed to get matchups")
          })
      })
      .catch((error) => {
        this.props.client.handleError(error, "Failed to get matchups")
      })

  }

  render() {
    const { matchups, eventName, my_rank } = this.state;
    let persons = matchups
    const { me } = this.props.store
    if (my_rank !== null) {
      let found = false
      for (var m of persons) {
        if (m.username === my_rank.username) {
          found = true
          break
        }
      }
      if (found !== true) {
        persons.push(my_rank)
      }
    }

    var d = new Date();
    let vals = [
      {label: "Today", value: 0},
      {label: "Yesterday", value: 1},
      {label: dateFormat(d.setDate(d.getDate() - 2), "UTC:dddd"), value: 2},
      {label: dateFormat(d.setDate(d.getDate() - 3), "UTC:dddd"), value: 3},
      {label: dateFormat(d.setDate(d.getDate() - 4), "UTC:dddd"), value: 4},
      {label: dateFormat(d.setDate(d.getDate() - 5), "UTC:dddd"), value: 5},
      {label: dateFormat(d.setDate(d.getDate() - 6), "UTC:dddd"), value: 6}
    ]

    var leaderboard = persons.map((person) => {
      const regular = { color: "white", height: "70px", backgroundColor: "#266586", display: "flex", alignItems: "center"}
      const highlight = { color: "#266586", height: "70px", backgroundColor: "#57e5c4", display: "flex", alignItems: "center"}
      const isMe = person.username === me.username
      return (
        <li key={person['username']} className="list-group-item" style={{padding:0}}>
          <div className="panel" style={{margin:0}}>
            <div className="panel-body" style={{padding: 0}}>
              <div className="col-md-1 text-center" style={isMe ? highlight : regular }>
                {person.rank}
              </div>
              <div className="col-md-2" style={{margin: "10px"}}>
                <img className="img-responsive img-circle" src={person.avatar} alt="Profile Picture" />
              </div>
              <div className="col-md-8" style={{marginTop: "10px"}}>
                <strong><span style={{fontSize: "20px"}}>{person.username}</span></strong>
                <br />
                Score: {person.score}
              </div>
            </div>
          </div>
        </li>
      )
    }) 

    return (
      <div>
        <div className="navbar-collapse collapse" id="navbar-second">
          <div className="navbar navbar-default navbar-xs">
            <ul className="nav navbar-nav">
              <li className="text-center">
                <Link to="/matchups/daily">
                  Daily Dominance
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="page-container" style={{minHeight: "68px"}}>
          <div className="page-content">
            <div className="content-wrapper">
              <h1 className="content-group text-semibold content-header text-center">
                {eventName}
              </h1>

              <div className="row">
                <div className="col-md-4 col-md-offset-4">
                  <select className="bootstrap-select" style={{width:"-webkit-fill-available"}} onChange={this.onChange}>
                    <option value={vals[0].value}>{vals[0].label}</option>
                    <option value={vals[1].value}>{vals[1].label}</option>
                    <option value={vals[2].value}>{vals[2].label}</option>
                    <option value={vals[3].value}>{vals[3].label}</option>
                    <option value={vals[4].value}>{vals[4].label}</option>
                    <option value={vals[5].value}>{vals[5].label}</option>
                    <option value={vals[6].value}>{vals[6].label}</option>
                  </select>
                  <ul className="list-group" style={{border: 0}}>
                    {leaderboard}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Matchups;
