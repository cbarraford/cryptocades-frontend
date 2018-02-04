import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom'
import Countdown from 'react-countdown-now';
import { Modal } from 'react-bootstrap/lib';
import odds from 'odds';

@inject('store')
@inject('client')
@observer
class UserNav extends Component {

  constructor(props) {
    super(props)

    this.state = {
      jackpots: [],
      open: false,
      total_entries: 0,
      my_entries: 0,
      pending_entries: 0,
    }
    
    this.props.client.balance()
      .then((response) => {
        this.props.store.balance = response.data.balance
      })
      .catch((error) => {
        console.log(error)
      })

    this.props.client.listJackpots()
      .then((response) => {
        this.setState({
          jackpots: response.data,
        })
      })
      .catch((error) => {
        console.log(error)
      })

    this.toggleModal = this.toggleModal.bind(this);
    this.updateOdds = this.updateOdds.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({[event.target.id]: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.jackpots.length > 0) {
      const id = this.state.jackpots[0].id
      const amount = parseInt(this.state.pending_entries, 10);
      this.props.client.jackpotEnter(id, amount)
        .then((response) => {
          this.toggleModal()
          this.props.client.balance()
            .then((response) => {
              this.props.store.balance = response.data.balance
            })
            .catch((error) => {
              console.log(error)
            })
        })
        .catch((error) => {
          this.props.client.handleError(error, "Failed to enter into jackpot")
        })
    }
  }

  toggleModal() {
    this.props.client.balance()
      .then((response) => {
        this.props.store.balance = response.data.balance
      })
      .catch((error) => {
        console.log(error)
      })

    this.props.client.listJackpots()
      .then((response) => {
        this.setState({
          jackpots: response.data,
        }, () => {
          this.updateOdds();
          this.setState({ open: !this.state.open })
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  updateOdds() {
    if (this.state.jackpots.length > 0) {
      const id = this.state.jackpots[0].id
      this.props.client.jackpotOdds(id)
        .then((response) => {
          this.setState({
            total_entries: response.data.total,
            my_entries: response.data.entries,
          })
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }

  render() {
    const { me, balance } = this.props.store;
    const { jackpots, open, total_entries, my_entries } = this.state;
    const o = odds(my_entries, total_entries)
    var jackpot = 0;
    var endtime = Date.now();
    if (jackpots.length > 0) {
      jackpot = jackpots[0].jackpot.toLocaleString();
      endtime = Date.parse(jackpots[0].end_time);
    }
    const showTicketCount = balance > 0 ? "" : " hide"
    return (
	<div className="navbar navbar-inverse">
		<div className="navbar-header">
			<Link className="navbar-brand" to="/"><img src="/assets/images/logo_light.png" alt="" /></Link>

			<ul className="nav navbar-nav pull-right visible-xs-block">
				<li><a data-toggle="collapse" data-target="#navbar-mobile"><i className="icon-tree5"></i></a></li>
			</ul>
		</div>

		<div className="navbar-collapse collapse" id="navbar-mobile">

			<p className="navbar-text"><span className="label bg-success-400">Jackpot ${jackpot} - <Countdown date={endtime} /></span></p>

			<ul className="nav navbar-nav navbar-right">
				<li>
          <a className="btn btn-icon" onClick={this.toggleModal}>
						<i className="fa fa-ticket"></i>
						<span className={"badge bg-warning-400" + showTicketCount}>{balance || 0}</span>
          </a>
				</li>
				<li className="dropdown dropdown-user">
					<a className="dropdown-toggle" data-toggle="dropdown">
						<img src={me.avatar} alt="" />
						<span>{me.username || "unknown"}</span>
						<i className="caret"></i>
					</a>

					<ul className="dropdown-menu dropdown-menu-right">
						<li><Link to="/profile"><i className="icon-user-plus"></i> My profile</Link></li>
						<li><Link to="/entries"><i className="icon-coins"></i> My entries</Link></li>
						<li className="divider"></li>
						<li><Link to="/logout"><i className="icon-switch2"></i> Logout</Link></li>
					</ul>
				</li>
			</ul>
		</div>

    <Modal
      show={open}
      onHide={this.toggleModal}
    >
      <Modal.Header className="bg-success" closeButton>
        <Modal.Title id='ModalHeader'>Enter the Jackpot!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h6 className="text-semibold">${jackpot}</h6>
        <p>Total entries: {total_entries}</p>

        <hr />

        <p>My entries: {my_entries}</p>
        <p>Odds: {o.format('fractional')}</p>

        <form onSubmit={this.handleSubmit}>
        <div className="form-group has-feedback">
        <input type="number" autoComplete="off" className="form-control" placeholder="Amount" onChange={this.handleChange} id="pending_entries" />
        </div>

        <button type="submit" className="btn bg-blue btn-block"> Enter Jackpot <i className="icon-arrow-right14 position-right"></i></button>
        </form>
      </Modal.Body>
      </Modal>
	</div>
  );
  }
}

export default UserNav;
