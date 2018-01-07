import React, { Component } from 'react';
import PropTypes from 'prop-types'
import CoinHive from 'react-coinhive'
import { Sparklines, SparklinesLine } from 'react-sparklines';
import { inject, observer } from 'mobx-react';

@inject('store')
@inject('client')
@observer
class Play extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
  }

  constructor (props) {
    super(props)

    this.state = {
      address: props.match.params.address,
      hashRate: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      acceptedHashes: 0,
      pauseBtn: "Stop",
      throttle: 100,
    };

    this.appendHashRate = this.appendHashRate.bind(this);
    this.setAcceptedHashes = this.setAcceptedHashes.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  toggle () {
    var miner = CoinHive.getMinerData(this._miner.miner)
    console.log(miner)
    console.log(miner.isRunning)
    if (miner.isRunning) {
      console.log("Stopping miner...")
      this._miner.stop()
      this.setState({ pauseBtn: "Start" })
    } else {
      console.log("Starting miner...")
      this._miner.start()
      this.setState({ pauseBtn: "Stop" })
    }
  }

  appendHashRate (rate) {
    var hashes = this.state.hashRate
    hashes.push(rate)
    hashes = hashes.slice(Math.max(hashes.length - 20, 1))
    this.setState({
      hashRate: hashes,
    })
  }

  setAcceptedHashes (accepted) {
    this.setState({
      acceptedHashes: accepted,
    })
  }

  handleOnChange (event) {
    console.log(event.target.value)
    this.setState({
      throttle: event.target.value
    })
  }

  render() {
    const username = this.state.address || this.props.store.me.btc_address
    const hashes = this.state.hashRate
    const lottoTickets = Math.floor(this.state.acceptedHashes/1000)
    const throttle = this.state.throttle
    const ticketsInSeconds = Math.ceil(1000 / hashes[hashes.length - 1])
    const pauseBtn = this.state.pauseBtn
    const pauseBtnType = (this.state.pauseBtn === "Start" ? 'btn btn-w-m btn-primary' : 'btn btn-w-m btn-danger')
    return (
        <div className="wrapper wrapper-content">
      <CoinHive
        ref={(c) => this._miner = c}
        userName={username}
        siteKey="2T7pPlB01sR46beblhuMFS0XoqDJiEta"
        src={CoinHive.src.authedmine}
        throttle={1 - (throttle / 100)}
        onInit={miner => setInterval(
          () => {
            console.log(CoinHive.getMinerData(miner))
            this.appendHashRate(miner.getHashesPerSecond())
            this.setAcceptedHashes(miner.getAcceptedHashes())
          }
          , 500
        )}
      />
      <div className="container">
      <div className="row">
      <div className="col-md-2">
        <div className="ibox float-e-margins">
          <div className="ibox-title">
            <h5>Jackpot!</h5>
          </div>
          <div className="ibox-content">
            <h1 className="no-margins">$100.00</h1>
          </div>
        </div>
      </div>
      <div className="col-md-2">
        <div className="ibox float-e-margins">
          <div className="ibox-title">
            <h5>Lotto Tickets Earned!</h5>
          </div>
          <div className="ibox-content">
            <h1 className="no-margins">{lottoTickets}</h1>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="ibox float-e-margins">
          <div className="ibox-title">
            <h5>Performance (New ticket every {ticketsInSeconds} seconds)</h5>
          </div>
          <div className="ibox-content">
            <p>
            <Sparklines data={hashes} limit={20} width={100} height={20} margin={5}>
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
            <label>Throttle</label>
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
      </div>
    );
  }
}

export default Play;
