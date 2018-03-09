import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Table } from 'react-bootstrap/lib';
import dateFormat from 'dateformat'

@inject('store')
@inject('client')
@observer
class MyEntries extends Component {

  constructor(props) {
    super(props)

    this.state = {
      rank: 0,
      incomes: [],
      games: [],
      entries: [],
      jackpots: [],
      tab: 1,
    }

    this.props.client.myrank()
      .then((response) => {
        this.setState({ rank: response.data.rank })
      })
      .catch((error) => {
        console.log(error)
      })

    this.props.client.balance()
      .then((response) => {
        this.props.store.balance = response.data.balance
      })
      .catch((error) => {
        console.log(error)
      })

    this.props.client.myincomes().then((response) => {
      this.setState({incomes: response.data || []})
    })
      .catch((error) => {
        this.props.client.handleError(error,"Failed to get incomes")
      })

    this.props.client.listGames().then((response) => {
      this.setState({games: response.data })
    })
      .catch((error) => {
        this.props.client.handleError(error, "Failed to get list of games")
      })

    this.props.client.myentries().then((response) => {
      this.setState({entries: response.data || []})
    })
      .catch((error) => {
        this.props.client.handleError(error,"Failed to get entries")
      })

    this.props.client.listJackpots().then((response) => {
      this.setState({jackpots: response.data })
    })
      .catch((error) => {
        this.props.client.handleError(error, "Failed to get list of jackpots")
      })

    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(tab) {
    this.setState({ tab });
  }

  render() {
    const { balance } = this.props.store;
    const { incomes, entries, jackpots, games, rank } = this.state;
    const attrPanel = {minHeight: "140px", backgroundColor: "#57e5c4", color: "#266586"}
    var entryList = entries.map((entry) => {
      var jackpot = {jackpot: 0};
      for (var j of jackpots) {
        if (j.id === entry.jackpot_id) {
          jackpot = j
          break
        }
      }
      return (
        <tr key={entry['id']}>
          <td>{dateFormat(Date.parse(jackpot['end_time']), "mmmm dS, yyyy")}</td>
          <td>{jackpot.jackpot} BTC</td>
          <td>{entry.amount}</td>
        </tr>
      )
    })

    var incomeList = incomes.map((income) => {
      // skip if no earnings
      if (income.amount === 0) {
        return null
      }
      var game = {id: 0};
      for (var g of games) {
        if (g.id === income.game_id) {
          game = g
          break
        }
      }
      return (
        <tr key={income['id']}>
          <td>{ game.id === 0 ? income.session_id : game.name }</td>
          <td>{dateFormat(Date.parse(income['updated_time']), "mmmm dS, yyyy")}</td>
          <td>{income.amount}</td>
        </tr>
      )
    })

    return (
      <div className="page-container" style={{minHeight: "68px"}}>
        <div className="page-content">
          <div className="content-wrapper">
      
            <div className="row">
              <div className="col-md-3 col-md-offset-3">
                <div className="panel" style={attrPanel}>
                  <div className="panel-body text-center">
                    <span style={{fontSize:"30px", fontWeight: 600}}>Balance</span>
                    <h3 className="no-margin" style={{fontSize: "20px"}}><i className="icon-ticket"></i> {balance}</h3>
                    <div className="text-size-small">
                      Number of available plays to use
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="panel" style={attrPanel}>
                  <div className="panel-body text-center">
                    <span style={{fontSize:"30px", fontWeight: 600}}>Rank</span>
                    <h3 className="no-margin">{rank}%</h3>
                    <div className="text-size-small">
                      Lifetime earnings ranking
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="panel panel-flat col-md-6 border-top-xlg border-top-warning" style={{borderTopColor: "#57e5c4"}}>
                <div className="panel-heading">
                  <h6 className="panel-title"><span className="text-semibold">Earned Plays</span></h6>
                </div>

                <div className="panel-body">
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th>Date</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {incomeList}
                    </tbody>
                  </Table>
                </div>
              </div>

              <div className="panel panel-flat col-md-6 border-top-xlg border-top-warning" style={{borderTopColor: "#57e5c4"}}>
                <div className="panel-heading">
                  <h6 className="panel-title"><span className="text-semibold">Spent Plays</span></h6>
                </div>

                <div className="panel-body">
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>Jackpot Date</th>
                        <th>Jackpot Amount</th>
                        <th>Number of Entries</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entryList}
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    )
  }
}

export default MyEntries;
