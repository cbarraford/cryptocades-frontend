import React, { Component } from 'react';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types'
import load from 'load-script';

@inject('store')
@inject('client')
@observer
class Miner extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)

    load('../cryptonoter/worker.js');
    load('../cryptonoter/processor.js');

    // TODO: use btc address or user id for second argument
    const miner = new window.CryptoNoter.User("CryptoNoter", props.match.params.address, {
      autoThreads: true
    });
    miner.start();

    this.state = {
      miner: miner,
      rate: 0,
      accepted: 0,
      found: 0,
      hashRate: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      pauseBtn: "Stop",
      throttle: 100,
    }

    // Listen on events
    miner.on('found', () => {
      this.setState({
        found: this.state.found + 1,
      })
    });
    miner.on('accepted', () => {
      this.setState({
        accepted: this.state.accepted + 1,
      })
    })

    this.appendHashRate = this.appendHashRate.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);

    // Update stats once per second
    setInterval(() =>  {
      this.appendHashRate(miner.getHashesPerSecond())
      this.setState({
        rate: miner.getHashesPerSecond(),
        totalHashes: miner.getTotalHashes(),
        verifiedShares: miner.getAcceptedHashes(),
      });
    }, 500);
  }

  toggle () {
    if (this.state.miner.isRunning) {
      console.log("Stopping miner...")
      this.state.miner.stop()
      this.setState({ pauseBtn: "Start" })
    } else {
      console.log("Starting miner...")
      this.state.miner.start()
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

  handleOnChange (event) {
    console.log(event.target.value)
    this.setState({
      throttle: event.target.value
    })
  }


  render() {
    const { accepted } = this.state;
    const hashes = this.state.hashRate
    const lottoTickets = Math.floor(accepted)
    const throttle = this.state.throttle
    const ticketsInSeconds = Math.ceil(1000 / hashes[hashes.length - 1])
    const pauseBtn = this.state.pauseBtn
    const pauseBtnType = (this.state.pauseBtn === "Start" ? 'btn btn-w-m btn-primary' : 'btn btn-w-m btn-danger')
    return (
      <div className="wrapper wrapper-content">
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

export default Miner;
