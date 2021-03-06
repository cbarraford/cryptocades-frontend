import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { inject, observer } from 'mobx-react';
import toastr from 'toastr'

@inject('store')
@inject('client')
@observer
class Games extends Component {

  constructor(props) {
    super(props)

    this.state = {
      games: [],
    }

    this.props.client.listGames().then((response) => {
      this.setState({games: response.data })
    })
      .catch((error) => {
        this.props.client.handleError(error, "Failed to get list of games")
      })

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(e, game) {
    if (game && !game.available) {
      e.preventDefault()
      toastr.info("Sorry, this game isn't available yet")
    }
  }

  render() {
    const { games } = this.state;
    const meId = this.props.store.me.id
    var gameList = games.map((game) => {
      return (
        <div key={game['id']} className={(game['available'] ? "" : "disabled-link ") + "col-md-3"}>
          <div className="thumbnail">
            <div className="thumb">
              <Link to={"/games/" + game['id'] + "/" + meId} onClick={(e) => this.handleClick(e, game)}>
                <img src={"/img/games/" + game['id'] + "/logo.png"} alt="" />
                <div className="caption-overflow">
                </div>
              </Link>
            </div>

            <div className="caption">
              <h6 className="no-margin-top text-semibold" style={{fontSize: "20px", fontWeight: 600}}>
                <Link to={"/games/" + game['id'] + "/" + meId} className="text-default" onClick={(e) => this.handleClick(e, game)}>
                  {game['name'] + (game['available'] ? "" : " (Coming Soon)")}
                </Link>
                <span className="pull-right badge" style={{backgroundColor:"#266586", fontSize: "15px", padding: "5px"}}>{game.type}</span>
              </h6>
              {game['description']}
            </div>
          </div>
        </div>
      )
    })

    return (
      <div className="page-container" style={{minHeight: "68px"}}>
        <div className="page-content">
          <div className="content-wrapper">
            <h1 className="content-group text-semibold content-header text-center">
              Games
            </h1>

            <div className="row">
              <div className="col-md-3"></div>
              {gameList}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Games;
