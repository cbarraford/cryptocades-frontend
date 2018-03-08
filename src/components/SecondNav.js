import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom'
import Countdown from 'react-countdown-now';
import { renderer } from './Jackpots'

@inject('store')
@inject('client')
@observer
class SecondNav extends Component {

  constructor(props) {
    super(props)

    this.state = {
      jackpots: [],
    }

    this.props.client.listJackpots()
      .then((response) => {
        this.setState({
          jackpots: response.data,
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }


  render() {
    const { btcPrice } = this.props.store
    const { jackpots } = this.state;
    var jackpot = 0;
    var endtime = Date.now();
    if (jackpots.length > 0) {
      jackpot = jackpots[0].jackpot
      endtime = Date.parse(jackpots[0].end_time);
    }
    return (
      <div className="navbar navbar-default secondbar" id="navbar-second">
        <ul className="nav navbar-nav no-border visible-xs-block">
          <li><a className="text-center collapsed" data-toggle="collapse" data-target="#navbar-second-toggle"><i className="icon-menu7"></i></a></li>
        </ul>

        <div className="navbar-collapse collapse" id="navbar-second-toggle">
          <ul className="nav navbar-nav">
            <li className="text-center">
              <Link to="/jackpots">
                <i className="fa fa-money-bill-alt"></i>
                <br />
                Jackpots
              </Link>
            </li>
            <li className="text-center">
              <Link to="/games">
                <i className="fa fa-trophy"></i>
                <br />
                Games
              </Link>
            </li>
            <li className="text-center">
              <Link to="/referral">
                <img src="/img/3diamonds.png" alt="free plays" style={{height: "1em"}}/>
                <br />
                Free Plays
              </Link>
            </li>
          </ul>

          <div className="pull-right text-right" style={{position: "absolute", right: "10px", bottom: "5px"}}>
            <span style={{fontSize: "24px"}}>
              <Countdown date={endtime} renderer={renderer} />
            </span>
            <br />
            <span style={{fontSize: "14px", fontWeight: 200}}>
              JACKPOT COUNTDOWN
            </span>
            <br />
            <span>
              <span style={{fontSize: "30px", fontWeight:600}}>
                <i class="fab fa-bitcoin"></i> {jackpot} ≈ ${(jackpot * btcPrice.usd).toFixed(2)}
              </span>
            </span>
          </div>
        </div>
      </div>
    )
  }
}


export default SecondNav;
