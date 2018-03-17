import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class GuestNav extends Component {

  constructor(props) {
    super(props)

    window.onresize = (e) => {
      let nav = document.getElementsByClassName('firstbar')[0]
      nav.style.minHeight = document.body.clientWidth / 9.3 + "px"
    }
  }

  componentDidUpdate(prevProps, prevState) {
    window.onresize();
  }

  render() {
    return (
      <div className="navbar navbar-default firstbar" style={{backgroundColor: "#fdfbf0"}}>
        <div className="navbar-header">
          <a className="navbar-brand" href="https://cryptocades.com"><img src="/img/logo.png" alt="" /></a>

          <ul className="nav navbar-nav visible-xs-block">
            <li>
              <a data-toggle="collapse" data-target="#navbar-mobile">
                <i className="icon-menu7" style={{color: "white"}}></i>
              </a>
            </li>
          </ul>
        </div>

        <div className="navbar-collapse collapse" id="navbar-mobile">
          <ul className="nav navbar-nav navbar-right">
            <li className="nav-item align-middle">
              <Link className="nav-link" to="/login">
                LOG IN
              </Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="https://cryptocades.com/#how-it-works">
                HOW IT WORKS
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="https://cryptocades.com/support">
                SUPPORT
              </a>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/signup">
                SIGN UP
              </Link>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}

export default GuestNav;
