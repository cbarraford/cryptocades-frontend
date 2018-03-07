import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { inject, observer } from 'mobx-react';

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
  }

  render() {
    const { games } = this.state;
    const meId = this.props.store.me.id
    var gameList = games.map((game) => {
      return (
					<div key={game['id']} className="col-lg-3 col-sm-6">
						<div className="thumbnail">
							<div className="thumb">
                <Link to={"/games/" + game['id'] + "/" + meId}>
                  <img src={"/img/games/" + game['id'] + "/logo.png"} alt="" />
                  <div className="caption-overflow">
                  </div>
                </Link>
							</div>

							<div className="caption">
								<h6 className="no-margin-top text-semibold">
                  <Link to={"/games/" + game['id'] + "/" + meId} className="text-default">
                    {game['name']}
                  </Link>
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
				<h6 className="content-group text-semibold">
          Games
					<small className="display-block">Select a game to play!</small>
				</h6>

				<div className="row">
          {gameList}
        </div>
			</div>
		</div>
	</div>
  )
  }
}

export default Games;
