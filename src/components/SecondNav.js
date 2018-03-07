import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class SecondNav extends Component {

  render() {
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
                <i className="fa fa-handshake"></i>
                <br />
                Free Plays
              </Link>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}


export default SecondNav;
