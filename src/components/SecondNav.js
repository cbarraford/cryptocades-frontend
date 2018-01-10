import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class SecondNav extends Component {

  render() {
    return (
    <div className="navbar navbar-default" id="navbar-second">
      <ul className="nav navbar-nav no-border visible-xs-block">
        <li><a className="text-center collapsed" data-toggle="collapse" data-target="#navbar-second-toggle"><i className="icon-menu7"></i></a></li>
      </ul>

      <div className="navbar-collapse collapse" id="navbar-second-toggle">
        <ul className="nav navbar-nav">
          <li>
            <Link to="/jackpots"><i className="icon-cash3 position-left"></i> Jackpots</Link>
          </li>
          <li>
            <Link to="/games"><i className="fa fa-gamepad position-left"></i> Games</Link>
          </li>
          <li>
            {/*<Link to="/store"><i className="icon-store2 position-left"></i> Store</Link> */}
          </li>
        </ul>
      </div>
    </div>
    )
  }
}


export default SecondNav;
