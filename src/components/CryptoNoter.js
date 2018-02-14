import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types'

@inject('store')
@inject('client')
@observer
export default class CryptoNoter extends Component {

  static propTypes = {
    autoThreads: PropTypes.bool,
    run: PropTypes.bool,
    threads: PropTypes.number,
    throttle: PropTypes.number,
    userName: PropTypes.string,
    gameId: PropTypes.string,
  }

  constructor(props) {
    super(props)

    this.state = {
      autoThreads: props.autoThreads || true,
      run: props.run || true,
      threads: props.threads || 2,
      throttle: props.throttle || 100,
      userName: props.userName,
      gameId: props.gameId,
      hashRateHistory: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      found: 0,
      accepted: 0,
    }

    this.appendHashRate = this.appendHashRate.bind(this);
    this.isRunning = this.isRunning.bind(this);

    this.initNoter()
  }

  initNoter() {
    if (this.miner) {
      this.stop();
      delete this.miner;
    }

    const key = this.state.gameId + "-" + Math.random().toString(36).substr(2, 12);
    this.miner = new window.CryptoNoter.User(key, this.state.userName);

    // Listen on events
    this.miner.on('found', () => {
      console.log("Found:", this.state.found + 1)
      this.props.stats({ found: this.state.found +1 })
      this.setState({
        found: this.state.found + 1,
      })
    });

    this.miner.on('accepted', () => {
      console.log("Accepted:", this.state.accepted + 1)
      this.props.stats({ accepted: this.state.accepted +1 })
      this.setState({
        accepted: this.state.accepted + 1,
      }, () => {
        this.props.client.balance()
          .then((response) => {
            this.props.store.balance = response.data.balance
          })
          .catch((error) => {
            console.log(error)
          })
      })

    })

    this.setupNoter()

    //this.props.onInit(this.miner)
    if (this.state.run) {
      this.start()
    }

    // Update stats once per second
    const timer = setInterval(() =>  {
      if (this.miner) {
        this.appendHashRate(this.miner.getHashesPerSecond())
        console.log(this.miner.getHashesPerSecond(), "H/s")
        this.props.stats({
          hashRateHistory: this.state.hashRateHistory,
          hashRate: this.miner.getHashesPerSecond(),
          totalHashes: this.miner.getTotalHashes(),
          accepted: this.state.accepted,
        })
      } else {
        clearInterval(timer)
      }
    }, 500);
  }

  setupNoter() {
    if (this.state.autoThreads) {
      this.miner.setAutoThreadsEnabled(true)
    } else {
      this.miner.setAutoThreadsEnabled(false)
      this.miner.setNumThreads(this.state.threads);
    }
    // we have to invert our number for some reason, 0 if full power, 1 is
    // lowest power
    const throttle = Math.abs(this.state.throttle - 100) / 100
    this.miner.setThrottle(throttle);
  }

  start() {
    if (!this.miner) return;
    this.miner.start();
    //this.props.onStart(this.miner);
  }

  stop() {
    if (!this.miner) return;
    this.miner.stop();
    //this.props.onStop(this.miner);
  }

  isRunning() { 
    return this.miner.isRunning() 
  }

  toggle () {
    if (this.miner.isRunning()) {
      console.log("Stopping miner...")
      this.stop()
    } else {
      console.log("Starting miner...")
      this.start()
    }
  }

  appendHashRate (rate) {
    var hashes = this.state.hashRateHistory
    hashes.push(rate)
    hashes = hashes.slice(Math.max(hashes.length - 20, 1))
    this.setState({
      hashRateHistory: hashes,
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.miner || this.state.userName !== prevProps.userName) {
      this.initNoter();
    } else if (
      prevProps.threads !== this.state.threads
      || prevProps.autoThreads !== this.state.autoThreads
      || prevProps.throttle !== this.state.throttle
      || prevProps.userName !== this.state.userName
      || prevProps.siteKey !== this.state.siteKey
    ) {
      this.setupNoter();
    } else if (prevProps.run !== this.state.run) {
      if (this.state.run) {
        this.start();
      } else {
        this.stop();
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps)
  }

  componentWillUnmount() {
    console.log('unmounting cryptonoter')
    this.stop()
    this.miner = null
  }

  render() { return null }

}
