import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { inject, observer } from 'mobx-react';
import Countdown from 'react-countdown-now';
import toastr from 'toastr'

import dateFormat from 'dateformat'

@inject('store')
@inject('client')
@observer
class Jackpots extends Component {

  constructor(props) {
    super(props)
    
    this.state = {
      jackpots: [],
    }

    this.props.client.listJackpots().then((response) => {
      this.setState({jackpots: response.data })
    })
    .catch((error) => {
      console.log("Error getting games:", error)
      toastr.error("Failed to reset password:", error)
    })
  }

  render() {
    const { jackpots } = this.state;

    var currentJackpots = jackpots.map((jackpot) => {
      if (Date.parse(jackpot.end_time) < Date.now()) {
        return ""
      }
      return (
					<div key={jackpot['id']} className="col-lg-3 col-sm-6">
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
                    Amount: ${jackpot['jackpot']}
                  </Link>
                </h6>
                Countdown: <Countdown date={Date.parse(jackpot['end_time'])} />
							</div>
						</div>
					</div>
      )
    })

    var completedJackpots = jackpots.map((jackpot) => {
      if (Date.parse(jackpot.end_time) >= Date.now()) {
        return ""
      }
      return (
					<div key={jackpot['id']} className="col-lg-3 col-sm-6">
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
                    Amount: ${jackpot['jackpot']}
                  </Link>
                </h6>
                Ended: {dateFormat(Date.parse(jackpot['end_time']), "mmmm dS, yyyy, h:MM:ss TT")}
							</div>
						</div>
					</div>
      )
    })

    return (
  <div className="page-container" style={{minHeight: "68px"}}>
		<div className="page-content">
			<div className="content-wrapper">
				<h6 className="content-group text-semibold">
          Jackpots
				</h6>

				<div className="row">
          <h6>Current Jackpots</h6>
          {currentJackpots}
        </div>
				<div className="row">
          <h6>Past Jackpots</h6>
          {completedJackpots}
        </div>
			</div>
		</div>
	</div>
  )
  }
}

export default Jackpots;
