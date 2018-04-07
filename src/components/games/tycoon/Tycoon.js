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
  }
}
window.state = state;

function showPage(page) {
  state.pages.start_page.title.setVisible(page === "start")
  state.pages.start_page.start_btn.setVisible(page === "start")
  //state.pages.main.setVisible(page === "main")
}

function preload() {
  this.load.image('start-btn', '/img/games/2/start.png');
  this.load.image('space-bg', '/img/games/2/space-bg.jpeg');
}

function create() {
  let space_bg = this.add.image(state.canvas.width / 2, state.canvas.height / 2, 'space-bg')

  state.pages.start_page.title = this.add.text( state.canvas.width / 2, state.canvas.height / 2, "Asteroid Tycoon", { fontFamily: "Titillium Web", fontSize: '20px', fill: '#fff', align: 'center' })
  state.pages.start_page.title.setPosition(
    (state.canvas.width / 2) - (state.pages.start_page.title.width / 2), 
    state.canvas.height / 2
  )

  state.pages.start_page.start_btn = this.add.sprite(
    state.canvas.width / 2,
    state.canvas.height / 2,
    'start-btn',
  ).setInteractive()
  state.pages.start_page.start_btn.setPosition(
    state.canvas.width / 2,
    state.canvas.height / 2 + state.pages.start_page.start_btn.height,
  )

  // show start page
  showPage("start")

  this.input.on('pointerup', function (pointer, gameObject) {
    console.log("Clicked!")
    client.tycoonGetAccount()
      .then((response) => {
        state.account = response.data
        client.tycoonGetShips()
          .then((response) => {
            state.ships = response.data
            showPage("main")
          })
          .catch((error) => {
            console.error(error)
          })
      })
      .catch((error) => {
        window.err = error
        if (error.response.status === 404) {
          client.tycoonCreateAccount()
            .then((response) => {
              state.account = response.data
              client.tycoonCreateShip() 
                .then((response) => {
                  state.ships = [response.data]
                  showPage("main")
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
