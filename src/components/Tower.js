import React, { Component } from 'react';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types'
import CryptoNoter from './CryptoNoter'

@inject('store')
@inject('client')
@observer
class Tower extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      userId: this.props.store.me.id || props.match.params.user_id,
      pauseBtn: "Stop",
      throttle: 100,
      hashRateHistory: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      hashRate: 0,
      totalHashes: 0,
      accepted: 0,
      found: 0,
    }

    this.toggle = this.toggle.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.updateMineStats = this.updateMineStats.bind(this);
  }

  updateMineStats(stats) {
    this.setState(stats)
  }

  toggle () {
    window.mminer = this.miner
    if (this.miner.isRunning()) {
      console.log("Stopping miner...")
      this.miner.stop()
      this.setState({ pauseBtn: "Start" })
    } else {
      console.log("Starting miner...")
      this.miner.start()
      this.setState({ pauseBtn: "Stop" })
    }
  }

  handleOnChange (event) {
    const val =  parseInt(event.target.value, 10)
    this.setState({
      throttle: val,
    })
  }


  render() {
    const { userId, throttle, accepted, hashRateHistory, hashRate } = this.state;
    const lottoTickets = Math.floor(accepted)
    const ticketsInSeconds = Math.ceil(1000 / hashRate)
    const pauseBtn = this.state.pauseBtn
    const pauseBtnType = (this.state.pauseBtn === "Start" ? 'btn btn-w-m btn-primary' : 'btn btn-w-m btn-danger')
    return (
      <div className="wrapper wrapper-content">
        <div className="container">
          <div className="row">
            <div className="col-md-2">
              <div className="ibox float-e-margins">
                <div className="ibox-title">
                  <h6>Tickets earned this session</h6>
                </div>
                <div className="ibox-content">
                  <h1 className="no-margins">{lottoTickets}</h1>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="ibox float-e-margins">
                <div className="ibox-title">
                  <h5>Performance (New ticket every {ticketsInSeconds} seconds: {hashRate.toFixed(2)})</h5>
                </div>
                <div className="ibox-content">
                  <p>
                    <Sparklines data={hashRateHistory} limit={20} width={100} height={20} margin={5}>
                      <SparklinesLine style={{ fill: "none" }} />
                    </Sparklines>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="ibox float-e-margins">
                <div className="ibox-title">
                  <h5>Controls</h5>
                </div>
                <div className="ibox-content">
                  <button type="button" className={pauseBtnType} onClick={this.toggle}>{pauseBtn}</button>
                  <br />
                  <label>Throttle: {throttle}</label>
                  <input 
                    id="typeinp" 
                    type="range" 
                    min="0" max="100" 
                    defaultValue="100"
                    value={throttle} 
                    onChange={this.handleOnChange}
                    step="1"/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <CryptoNoter ref={(miner) => { 
          if ( miner ) {
            this.miner = miner.wrappedInstance.wrappedInstance
          }
        }} stats={this.updateMineStats} threads={2} autoThreads={true} throttle={throttle} userName={userId} run={true} />
      </div>
    );
  }
}

export default Tower;
