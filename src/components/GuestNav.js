import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class GuestNav extends Component {

  constructor(props) {
    super(props)

    window.onresize = (e) => {
      let nav = document.getElementsByClassName('firstbar')[0]
      nav.style.height = document.body.clientWidth / 9.3 + "px"
    }
  }

  componentDidUpdate(prevProps, prevState) {
    window.onresize();
  }

  render() {
    return (
      <div className="navbar navbar-default firstbar" style={{backgroundColor: "#fdfbf0"}}>
        <div className="navbar-header">
          <a className="navbar-brand" to="https://cryptocades.com"><img src="/img/logo.png" alt="" /></a>

          <ul className="nav navbar-nav pull-right visible-xs-block">
            <li><a data-toggle="collapse" data-target="#navbar-mobile"><i className="icon-tree5"></i></a></li>
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
              <Link className="nav-link" to="/how_it_works">
                HOW IT WORKS
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/support">
                SUPPORT
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/signup" style={{padding: "7px"}}>
                <button style={{background:"none", fontSize: "10px", color: "white", borderColor:"white"}} type="button" className="btn">SIGN UP</button>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}

export default GuestNav;
