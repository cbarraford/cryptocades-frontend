import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import dateFormat from 'dateformat'

@inject('store')
@inject('client')
@observer
class Winners extends Component {

  constructor(props) {
    super(props)

    this.state = {
      jackpots: [],
    }

    this.props.client.listJackpots()
      .then((response) => {
        this.setState({jackpots: response.data })
      })
      .catch((error) => {
        this.props.client.handleError(error, "Failed to get list of jackpots")
      })
  }

  render() {
    const { jackpots, } = this.state;
    const { btcPrice } = this.props.store;

    const attrPanel = {minHeight: "140px", backgroundColor: "#57e5c4", color: "#266586"}
    var completedJackpots = jackpots.map((jackpot) => {
      if (Date.parse(jackpot.end_time) >= Date.now()) {
        return ""
      }
      const hasTransactionId = jackpot.transaction_id !== ""
      return (
        <div key={jackpot['id']} className="col-md-3">
          <div className="panel" style={attrPanel}>
            <div className="panel-body">
              <div className={(hasTransactionId ? "" : "hide ") + "heading-elements"}>
                <ul className="icons-list">
                  <li><a href={"https://blockchain.info/tx/" + jackpot.transaction_id} target="_blank"><i className="fas fa-external-link-alt"></i> Verified</a></li>
                </ul>
              </div>
              <h3 style={{fontSize:"30px", fontWeight: 600}} className="no-margin">${(jackpot['jackpot'] * btcPrice.usd).toFixed(2)}</h3>
              <i className="fab fa-bitcoin"></i> {jackpot.jackpot}
                <div className="text-size-small">
                  Ended: {dateFormat(Date.parse(jackpot['end_time']), "mmmm dS, yyyy, h:MM:ss TT")}
                </div>
              </div>
            </div>
          </div>
      )
    }) 

    return (
      <div className="page-container" style={{minHeight: "68px"}}>
        <div className="page-content">
          <div className="content-wrapper">
            <h1 className="content-group text-semibold content-header text-center">
              Winners
            </h1>

            <div className="row">
              {completedJackpots}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Winners;
