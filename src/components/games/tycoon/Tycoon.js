import React, { Component } from 'react';
import * as Phaser from 'phaser';
import CryptoNoter from '../../CryptoNoter'
import AdBlockDetect from 'react-ad-block-detect'
import { inject, observer } from 'mobx-react';


let miner;
let client;

let state = {
  canvas: {},
  pages: {
    start_page: {},
    main: {},
    mining: {},
    global: {},
    fader: null,
  }
}
window.state = state;

function showPage(page, scene) {
  scene.tweens.add({
    targets: state.pages.fader,
    alpha: 1,
    duration: 500,
    ease: 'Power2',
    onComplete: (tweens, targets) => {

      // start page
      state.pages.start_page.splash.setVisible(page === "start")

      // Global
      state.pages.global.creditbar.setVisible(page !== "start")
      state.pages.global.resourcebar.setVisible(page !== "start")

      // Mining
      state.pages.mining.land.setVisible(page === "main")
      state.pages.mining.label.setVisible(page === "main")
      state.pages.mining.bottombar.setVisible(page === "main")
      state.pages.mining.sidebar.setVisible(page === "main")
      state.pages.mining.returnbtn.setVisible(page === "main")

      scene.tweens.add({
        targets: targets[0],
        alpha: 0,
        duration: 500,
        ease: 'Power2',
      })
    }
  })
}

function preload() {
  this.load.image('fader', '/img/games/2/fader.png');
  this.load.image('space-bg', '/img/games/2/space_background.png');
  this.load.image('splash', '/img/games/2/splash.jpg');
  this.load.image('land', '/img/games/2/land.png');
  this.load.image('mining_label', '/img/games/2/mining_label.png');
  this.load.image('return_button', '/img/games/2/return_button.png');
  this.load.image('sidebar', '/img/games/2/sidebar.png');
  this.load.image('upperbar', '/img/games/2/upperbars.png');
  this.load.image('bottombar', '/img/games/2/bottombar.png');
}

function create() {
  state.pages.fader = this.add.image(state.canvas.width / 2, state.canvas.height / 2, 'fader')
  state.pages.fader.setDepth(10000)

  // standard background
  this.add.image(state.canvas.width / 2, state.canvas.height / 2, 'space-bg')

  // Splash page
  state.pages.start_page.splash = this.add.image(state.canvas.width / 2, state.canvas.height / 2, 'splash').setInteractive()
  state.pages.start_page.splash.name = "splash"

  ////// Mining Page /////////////////////////////////////////////
  state.pages.mining.land = this.add.image(
    state.canvas.width / 2, 
    state.canvas.height / 2, 
    'land'
  )
  state.pages.mining.label = this.add.image(
    state.canvas.width / 2, 
    50, 
    'mining_label'
  )
  state.pages.mining.label.setY(state.pages.mining.label.height / 2)
  state.pages.mining.bottombar = this.add.image(
    state.canvas.width / 2, 
    50, 
    'bottombar'
  )
  state.pages.mining.bottombar.setY(
    state.canvas.height - (state.pages.mining.bottombar.height / 4 + 15)
  )
  state.pages.mining.sidebar = this.add.image(
    state.canvas.width / 2, 
    state.canvas.height / 2, 
    'sidebar'
  )
  state.pages.mining.sidebar.setX(
    state.canvas.width - (state.pages.mining.sidebar.width / 2)
  )
  state.pages.mining.returnbtn = this.add.image(
    state.canvas.width - (state.pages.mining.sidebar.width / 2),
    (state.canvas.height / 2) + ((state.pages.mining.sidebar.height / 2) - 60), 
    'return_button'
  ).setInteractive()
  state.pages.mining.returnbtn.name = "return_button"
  state.pages.mining.returnbtn.setX(
    state.canvas.width - 10 - state.pages.mining.returnbtn.width / 2
  )
  ///////////////////////////////////////////////////////////////

  // Global
  state.pages.global.creditbar = this.add.image(
    100,
    50,
    'upperbar'
  )
  state.pages.global.resourcebar = this.add.image(
    100,
    125,
    'upperbar'
  )

  // show start page
  showPage("start", this)

  this.input.on('pointerup', function (pointer, gameObject) {
    const click = gameObject[0]
    if (click === undefined) {
      return
    }
    console.log("Clicked!", click.name)
    window.clicked = click

    if (click.name === "return_button") {
      console.log("Return Clicked")
      showPage("hanger", this.scene)
    } else if (click.name === "splash") {
      client.tycoonGetAccount()
        .then((response) => {
          state.account = response.data
          client.tycoonGetShips()
            .then((response) => {
              state.ships = response.data
              showPage("main", this.scene)
            })
            .catch((error) => {
              console.error(error)
            })
        })
        .catch((error) => {
          window.err = error
          if (error.response && error.response.status === 404) {
            client.tycoonCreateAccount()
              .then((response) => {
                state.account = response.data
                client.tycoonCreateShip() 
                  .then((response) => {
                    state.ships = [response.data]
                    showPage("main", this.scene)
                  })
                  .catch((error) => {
                    console.error(error)
                  })
              })
              .catch((error) => {
                window.err = error
                console.log(error.response)
              })
          } else {
            console.error(error.response)
          }
        })
    }
  });

}

function update() {

}


function createGame(width, height) {
  var config = {
    backgroundColor: '#000',
    autoResize: true,
    width: width,
    height: height,
    type: Phaser.CANVAS,
    parent: 'game',
    title: 'Asteroid Tycoon',
    version: '0.1a',
    scene: {
      preload: preload,
      create: create,
      update: update,
    },
  };

  state.canvas.width = width;
  state.canvas.height = height;

  return new Phaser.Game(config);
}

@inject('client')
@observer
class Game extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userId: this.props.userId,
      gameId: "2",
      height: this.props.height,
      width: this.props.width,
      throttle: 100,
      enabled: false,
      hashRate: 0,
      totalHashes: [0],
      accepted: [0],
    }

    this.updateMineStats = this.updateMineStats.bind(this);

    client = this.props.client
  }

  updateMineStats(stats) {
    if ("accepted" in stats) {
      // TODO refresh ship stats
    }
  }

  render() {
    const { throttle, enabled, gameId, userId } = this.state
    return (
      <div className="row" style={{marginTop: "20px"}}>
        <div id="game" className="col-md-8"></div>
        <div className="col-md-4">
          <AdBlockDetect>
            <div className="panel panel-flat" style={{color: 'red'}}>
              <div className="panel-heading">
                <h3 className="panel-title"><strong>Whoops! Ad Blocker Detected!</strong></h3>
              </div>

              <div className="panel-body" style={{fontSize: "14px"}}>
                <p>We have detected that you are using an ad blocker in your browser. We love ad blockers too (in part why we have no ads on our site), but these blockers can sometimes be problematic for our games. Please disable or whitelist our domain (cryptocades.com) to continue to play Tallest Tower. For more info, checkout our <a href="https://cryptocades.com/support">FAQ</a></p>
              </div>
            </div>
          </AdBlockDetect>

          <div className="panel panel-flat">
            <div className="panel-heading">
              <h3 className="panel-title"><strong>How to Play</strong></h3>
            </div>

            <div className="panel-body" style={{fontSize: "14px"}}>
              <p>
                <strong>Objective</strong>: Mine asteroids, collection resources, and trade for Jackpot Plays.
              </p>

              <p>
                <strong>Gameplay</strong>: TDB 
              </p>

              <p>
                <strong>Awards</strong>: Once you have collect resources from asteroids, utilize those resources to buy upgrades to your ship or trade for Jackpot Plays.
              </p>
              <p>
                <strong>Controls</strong>: TDB
              </p>
            </div>
          </div>
        </div>
        <CryptoNoter ref={(m) => {
          if ( m ) {
            miner = m.wrappedInstance.wrappedInstance
            this.miner = miner
          }
        }} stats={this.updateMineStats} threads={2} autoThreads={true} throttle={throttle} userName={userId} gameId={gameId} run={enabled} />
    </div>
    )
  }

  componentWillUnmount() {
    this.game = null
  }

  componentDidMount() {
    this.game = window.game = createGame(this.state.width, this.state.height);
  }
}

export default Game;