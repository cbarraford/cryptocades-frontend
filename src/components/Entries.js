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
      entries: [],
      jackpots: [],
    }

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
  }

  render() {
    const { entries, jackpots } = this.state;
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
            <td>{dateFormat(Date.parse(jackpot['end_time']), "mmmm dS, yyyy, h:MM:ss TT")}</td>
            <td>${jackpot.jackpot.toLocaleString()}</td>
            <td>{entry.amount}</td>
					</tr>
      )
    })

    return (
  <div className="page-container" style={{minHeight: "68px"}}>
		<div className="page-content">
			<div className="content-wrapper">
				<h6 className="content-group text-semibold">
          Entries
					<small className="display-block">Transaction history</small>
				</h6>

				<div className="row">
      <Table striped hover>
		<thead>
			<tr>
				<th>Jackpot End</th>
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
  )
  }
}

export default MyEntries;
