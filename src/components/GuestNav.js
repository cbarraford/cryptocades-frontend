import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class GuestNav extends Component {

  render() {
    return (
      <div className="navbar navbar-inverse">
		<div className="navbar-header">
			<Link className="navbar-brand" to="/"><img src="/img/logo.png" alt="" /></Link>

			<ul className="nav navbar-nav pull-right visible-xs-block">
				<li><a data-toggle="collapse" data-target="#navbar-mobile"><i className="icon-tree5"></i></a></li>
			</ul>
		</div>

		<div className="navbar-collapse collapse" id="navbar-mobile">
			<ul className="nav navbar-nav navbar-right">
				<li>
					<Link to="/signup">
						<i className="fa fa-user-plus"></i> Sign Up
					</Link>
				</li>
				<li>
					<Link to="/login">
						<i className="fa fa-sign-in"></i> Log In
					</Link>
				</li>
			</ul>
		</div>
	</div>
  )
  }
}

export default GuestNav;
