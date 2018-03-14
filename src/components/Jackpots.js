import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Countdown from 'react-countdown-now';
import odds from 'odds';
import toastr from 'toastr'

// Renderer callback with condition
export function renderer({ days, hours, minutes, seconds, completed }) {
  if (completed) {
    // Render a completed state
    return (
      <span>Jackpot ended!</span>
    )
  } else {
    // Render a countdown
    let parts = []
    if (days > 0) {
      parts.push(days + " days")
    }
    if (hours > 0 && parts.length < 2) {
      parts.push(hours + " hours")
    }
    if (minutes > 0 && parts.length < 2) {
      parts.push(minutes + " minutes")
    }
    if (seconds > 0 && parts.length < 2) {
      parts.push(seconds + " seconds")
    }
    return (
      <span>{parts.join(' and ')}</span>
    )
  }
}

@inject('store')
@inject('client')
@observer
class Jackpots extends Component {

  constructor(props) {
    super(props)

    this.state = {
      jackpots: [],
      total_entries: 0,
      my_entries: 0,
      pending_entries: 0,
    }

    this.props.client.listJackpots()
      .then((response) => {
        this.setState({jackpots: response.data }, () => {
          this.updateOdds(response.data[0].id)
        })
      })
      .catch((error) => {
        this.props.client.handleError(error, "Failed to get list of jackpots")
      })

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
          toastr.success('Entered jackpot!')
          this.setState({ pending_entries: 0 }, () => {
            this.refs.pending_entries.value = 0
          })
          this.updateOdds(id)
          this.props.client.balance()
            .then((response) => {
              this.props.store.balance = response.data.balance
            })
            .catch((error) => {
              console.error(error)
            })
        })
        .catch((error) => {
          this.props.client.handleError(error, "Failed to enter into jackpot")
        })
    }
  }

  updateOdds(id) {
    this.props.client.jackpotOdds(id)
      .then((response) => {
        this.setState({
          total_entries: response.data.total,
          my_entries: response.data.entries,
        })
      })
      .catch((error) => {
        console.error(error)
      })
  }

  render() {
    const { jackpots, total_entries, my_entries, pending_entries } = this.state;
    const { btcPrice } = this.props.store;
    const o = odds(my_entries, total_entries)
    const attrPanel = {minHeight: "140px", backgroundColor: "#57e5c4", color: "#266586"}

    var currentJackpots = jackpots.map((jackpot) => {
      if (Date.parse(jackpot.end_time) < Date.now()) {
        return ""
      }
      return (
        <div key={jackpot['id']}>
          <div className="row">

            <div className="col-md-4">
              <div className="panel" style={attrPanel}>
                <div className="panel-body text-center">
                  <span style={{fontSize:"30px", fontWeight: 600}}>Prize</span>
                  <h3 className="no-margin" style={{fontSize: "20px"}}><i className="fab fa-bitcoin"></i> {jackpot.jackpot}</h3>
                  <div className="text-size-small">
                    (valued at ~${(jackpot['jackpot'] * btcPrice.usd).toFixed(2)} USD)
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="panel" style={attrPanel}>
                <div className="panel-body text-center">
                  <span style={{fontSize:"30px", fontWeight: 600}}>Your Odds</span>
                  <h3 className="no-margin">{my_entries > 0 ? o.format('fractional'): "You haven't entered this jackpot"}</h3>
                  <div className="text-size-small">
                    (total entries: {total_entries.toLocaleString()})
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="panel" style={attrPanel}>
                <div className="panel-body text-center">
                  <span style={{fontSize:"30px", fontWeight: 600}}>Countdown</span>
                  <h6 className="">
                    <i className="fas fa-clock"></i> <Countdown date={Date.parse(jackpot['end_time'])} renderer={renderer}/>
                  </h6>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="panel panel-flat border-top-xlg border-top-warning col-md-6 col-md-offset-3" style={{borderTopColor: "#57e5c4"}}>
              <div className="panel-heading">
                <h6 className="panel-title"><span className="text-semibold">Enter amount of plays to enter</span></h6>
              </div>

              <div className="panel-body">
                <form onSubmit={this.handleSubmit}>
                  <div className="form-group has-feedback">
                    <input min="0" type="number" autoComplete="off" className="form-control" placeholder="Amount" onChange={this.handleChange} ref="pending_entries" id="pending_entries" />
                  </div>

                  <button type="submit" className="btn btn-block" style={{backgroundColor: "#266586", color: "#fdfbf0"}} disabled={pending_entries <= 0}>Enter Jackpot</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )
    })

      /*var completedJackpots = jackpots.map((jackpot) => {
      if (Date.parse(jackpot.end_time) >= Date.now()) {
        return ""
      }
      return (
        <div key={jackpot['id']}>
          <div className="thumbnail">
            <div className="thumb">
              <Link to={"/games/" + jackpot['id']}>
                <img src="assets/images/placeholder.jpg" alt="" />
                <div className="caption-overflow">
                </div>
              </Link>
            </div>

            <div className="caption">
              <h6 className="no-margin-top text-semibold">
                <Link to={"/games/" + jackpot['id']} className="text-default">
                  Amount: ${jackpot['jackpot'] * btcPrice.usd}
                </Link>
              </h6>
              Ended: {dateFormat(Date.parse(jackpot['end_time']), "mmmm dS, yyyy, h:MM:ss TT")}
            </div>
          </div>
        </div>
      )
    }) */

    return (
      <div className="page-container" style={{minHeight: "68px"}}>
        <div className="page-content">
          <div className="content-wrapper">
            <h1 className="content-group text-semibold content-header text-center">
              Current Jackpot
            </h1>

            <div className="row">
                {currentJackpots}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Jackpots;
