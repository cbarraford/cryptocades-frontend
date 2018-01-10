import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom'

@inject('store')
@inject('client')
@observer
class DefaultLayout extends Component {

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
    const { me } = this.props.store;
    const { jackpots } = this.state;
    var jackpot = 0;
    if (jackpots.length > 0) {
      jackpot = jackpots[0].jackpot.toLocaleString();
    }
    console.log("ME:", me);
    console.log("Mined:", me.mined_hashes);
    const tickets = me.mined_hashes + me.bonus_hashes;

    return (
	<div className="navbar navbar-inverse">
		<div className="navbar-header">
			<Link className="navbar-brand" to="/"><img src="/assets/images/logo_light.png" alt="" /></Link>

			<ul className="nav navbar-nav pull-right visible-xs-block">
				<li><a data-toggle="collapse" data-target="#navbar-mobile"><i className="icon-tree5"></i></a></li>
			</ul>
		</div>

		<div className="navbar-collapse collapse" id="navbar-mobile">

			<p className="navbar-text"><span className="label bg-success-400">Jackpot ${jackpot}</span></p>

			<ul className="nav navbar-nav navbar-right">
				<li>
          <Link to="/store">
						<i className="fa fa-ticket"></i>
						<span className="badge bg-warning-400">{tickets || 0}</span>
          </Link>
				</li>
				<li className="dropdown dropdown-user">
					<a className="dropdown-toggle" data-toggle="dropdown">
						<img src="/assets/images/placeholder.jpg" alt="" />
						<span>{me.username || "unknown"}</span>
						<i className="caret"></i>
					</a>

					<ul className="dropdown-menu dropdown-menu-right">
						<li><Link to="/profile"><i className="icon-user-plus"></i> My profile</Link></li>
						<li><Link to="/balance"><i className="icon-coins"></i> My balance</Link></li>
						<li className="divider"></li>
						<li><Link to="/settings"><i className="icon-cog5"></i> Account settings</Link></li>
						<li><Link to="/logout"><i className="icon-switch2"></i> Logout</Link></li>
					</ul>
				</li>
			</ul>
		</div>
	</div>
  );
  }
}

export default DefaultLayout;
