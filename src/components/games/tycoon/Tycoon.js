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
    upgrade: {},
    global: {},
    to_hanger: {},
    to_asteroid: {},
    hanger: {},
    fader: null,
  },
  autopilot: false,
  ship: null,
  ships: [],
  session: null,
  frame: null,
  scene: null,
}
window.state = state;

function showPage(page, scene) {
  
  // if we're already on the page, skip
  if (page === state.frame) {
    return
  }
  state.frame = page
  console.log("Going to Page:", state.frame)

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
      state.pages.global.creditsLabel.setVisible(page !== "start")
      state.pages.global.resourceLabel.setVisible(page !== "start")
      state.pages.global.resourceValue.setVisible(page !== "start")
      state.pages.global.creditsValue.setVisible(page !== "start")
      state.pages.global.notice.setVisible(page !== "start" && page !== "upgrade" && page !== "trade")

      // Hanger 
      state.pages.hanger.title.setVisible(page === "hanger")
      state.pages.hanger.tradebtn.setVisible(page === "hanger")
      state.pages.hanger.upgradebtn.setVisible(page === "hanger")
      
      // To Hanger
      state.pages.to_hanger.title.setVisible(page === "toHanger")
      state.pages.to_hanger.eta.setVisible(page === "toHanger" || page === "toAsteroid")
      state.pages.to_hanger.etaLabel.setVisible(page === "toHanger" || page === "toAsteroid")

      // Upgrade
      state.pages.upgrade.title.setVisible(page === "upgrade")
      state.pages.upgrade.bg.setVisible(page === "upgrade" || page === "trade")
      state.pages.upgrade.back.setVisible(page === "upgrade" || page === "trade")

      // Mining
      state.pages.mining.land.setVisible(page === "mining")
      state.pages.mining.label.setVisible(page === "mining")
      state.pages.mining.returnbtn.setVisible(page === "mining")
      state.pages.mining.crystalsIcon.setVisible(page === "mining")
      state.pages.mining.crystalsLabel.setVisible(page === "mining")
      state.pages.mining.crystalsValue.setVisible(page === "mining")
      state.pages.mining.totalAsteroidsLabel.setVisible(page === "mining" || page === "hanger")
      state.pages.mining.totalAsteroidsValue.setVisible(page === "mining" || page === "hanger")
      state.pages.mining.totalResourceLabel.setVisible(page === "mining" || page === "hanger")
      state.pages.mining.totalResourceValue.setVisible(page === "mining" || page === "hanger")
      state.pages.mining.meter_bg.setVisible(page === "mining")
      state.pages.mining.meter.setVisible(page === "mining")
      state.pages.mining.rpm.setVisible(page === "mining")
      state.pages.mining.spaceship.setVisible(page === "mining" || page === "hanger" || page === "toHanger" || page === "toAsteroid")
      state.pages.mining.spaceship.setFlipX(page === "toAsteroid")
      state.pages.mining.resourceRemaining.setVisible(page === "mining")
      state.pages.mining.sidebar.setVisible(page === "mining" || page === "hanger")
      state.pages.mining.autopilot.setVisible(page === "mining" || page === "hanger")
      state.pages.mining.healthIcon.setVisible(page === "mining" || page === "hanger")
      state.pages.mining.healthLabel.setVisible(page === "mining" || page === "hanger")
      state.pages.mining.healthValue.setVisible(page === "mining" || page === "hanger")
      state.pages.mining.shipLabel.setVisible(page === "mining" || page === "hanger")

      state.pages.mining.bottombar.setVisible(page !== "start" && page !== "upgrade" && page !== "trade")

      scene.tweens.add({
        targets: targets[0],
        alpha: 0,
        duration: 500,
        ease: 'Power2',
      })
    }
  })
}

function meter(percentage) {
  state.pages.mining.meter.setScale(Math.max(percentage,0), 1)
}
window.meter = meter

function setNotice(msg) {
  state.pages.global.notice.setText(msg)
}

function setHealth(i) {
  if (state.pages.mining.healthValue) {
    if (i === 0 && state.pages.mining.healthValue.text !== "0%") {
      setNotice("Ship destroyed")
    }
    state.pages.mining.healthValue.setText(i + "%")
  }
}

function setTotalAsteroids(i) {
  if (state.pages.mining.totalAsteroidsValue) {
    state.pages.mining.totalAsteroidsValue.setText(i.toLocaleString())
  }
}

function setTotalResources(i) {
  if (state.pages.mining.totalResourceValue) {
    state.pages.mining.totalResourceValue.setText(i.toLocaleString())
  }
}

function setCollected(i) {
  if (state.pages.mining.crystalsValue) {
    state.pages.mining.crystalsValue.setText(i.toLocaleString())
  }
}

function setResourceRemaining(i) {
  if (state.pages.mining.resourceRemaining) {
    state.pages.mining.resourceRemaining.setText(i + " Remaining")
  }
}

const autopilot = setInterval(() => {
  if (state.ship === null && state.ships.length > 0) {
    client.tycoonGetShipStatus(state.ships[0].id)
      .then((response) => {
        state.ship = response.data
        setHealth(state.ship.ship.health)
        setTotalAsteroids(state.ship.ship.total_asteroids)
        setTotalResources(state.ship.ship.total_resources)
        client.tycoonUpdateShip(state.ships[0].id, {
          session_id: state.session,
        })
          .then((response) => {
            console.log("Updated ship session id")
          })
          .catch((error) => {
            console.error(error)
          })
        return
      })
      .catch((error) => {
        console.error(error)
      })
  }
  if (state.ships.length > 0) {
    client.tycoonGetShipStatus(state.ships[0].id)
      .then((response) => {
        state.ship = response.data
        state.pages.to_hanger.eta.setText(Math.max(0, state.ship.remaining_time) + " seconds")

        setHealth(state.ship.ship.health)
        setTotalAsteroids(state.ship.ship.total_asteroids)
        setTotalResources(state.ship.ship.total_resources)
        if (state.ship.status === "Approaching Asteroid") {
          showPage("toAsteroid", state.scene)
          miner.stop()
          setNotice("Traveling to our asteroid...")
          return
        } else if (state.ship.status === "Approaching Space Station") {
          showPage("toHanger", state.scene)
          miner.stop()
          setNotice("Asteroid has been mined, heading back to the hanger...")
          return
        } else if (state.ship.status === "Mining") {
          showPage("mining", state.scene)
          miner.start()
          setNotice("Mining our asteroid... please wait.")
          client.tycoonGetShipStatus(state.ships[0].id)
            .then((response) => {
              state.ship = response.data
              const ast = state.ship.asteroid
              meter(ast.remaining / ast.total)
              setResourceRemaining(ast.remaining)
              setHealth(state.ship.ship.health)
              setTotalAsteroids(state.ship.ship.total_asteroids)
              setTotalResources(state.ship.ship.total_resources)
              setCollected(state.ship.asteroid.total - state.ship.asteroid.remaining)
            })
            .catch((error) => {
              console.error(error)
            })
          return
        } else {
          if (state.frame !== "upgrade" && state.frame !== "trade") {
            showPage("hanger", state.scene)
          }
          if (state.ship.ship.health === 0) {
            miner.start()
            setNotice("Ship destroyed! You lost your cargo! Repairing your ship...")
          } else if (state.ship.ship.health < 100) {
            miner.start()
            setNotice("Repairing ship... please wait.")
          } else {
            miner.stop()
          }
          if (state.autopilot && state.ship.asteroid.remaining < state.ship.asteroid.total) {
            client.tycoonCompletedAsteroid({
              ship_id: state.ships[0].id,
            })
              .then((response) => {
                if (state.ship.ship.health > 0) {
                  setNotice("Successfully mined an asteroid")
                }
                client.tycoonGetAccount()
                  .then((response) => {
                    state.account = response.data
                    state.pages.global.creditsValue.setText(state.account.credits)
                    Phaser.Display.Align.In.Center(
                      state.pages.global.creditsValue, 
                      state.pages.global.creditbar,
                    );
                    state.pages.global.resourceValue.setText(state.account.resources.toLocaleString())
                    Phaser.Display.Align.In.Center(
                      state.pages.global.resourceValue,
                      state.pages.global.resourcebar,
                    );
                  })
              })
              .catch((error) => {
                console.error(error)
              })
          }
        }
        if (state.autopilot && state.ship.asteroid.id === 0 && state.ship.ship.health === 100) {
          console.log("Looking for asteroid to assign...")
          client.tycoonListAvailableAsteroids()
            .then((response) => {
              const asteroids = response.data
              for (let i in asteroids) {
                if (asteroids[i].total <= state.ships[0].cargo) {
                  client.tycoonAssignAsteroid({
                    ship_id: state.ships[0].id, 
                    asteroid_id: asteroids[i].id,
                    session_id: state.session,
                  })
                    .then((response) => {
                      console.log("Assigned Asteroid")
                      setNotice("New asteroid found.")
                      state.pages.mining.resourceRemaining.setText(asteroids[i].remaining + " Remaining")
                    })
                    .catch((error) => {
                      console.error(error)
                    })

                  break
                }
              }
            })
            .catch((error) => {
              console.error(error)
            })
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }
}, 3000)

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
  this.load.image('health', '/img/games/2/health.png');
  this.load.image('crystals', '/img/games/2/crystals.png');
  this.load.image('progress-bg', '/img/games/2/progress-meter-blue.png');
  this.load.image('progress', '/img/games/2/progress-meter-green.png');
  this.load.image('auto-pilot-off', '/img/games/2/auto-pilot.png');
  this.load.image('auto-pilot-on', '/img/games/2/auto-pilot-on.png');
  this.load.image('spaceship', '/img/games/2/spaceship.png');
  this.load.image('hanger-text', '/img/games/2/hanger-text.png');
  this.load.image('approaching-hanger', '/img/games/2/approaching-hanger.png');
  this.load.image('trade-btn', '/img/games/2/trade.png');
  this.load.image('upgrade-btn', '/img/games/2/upgrade.png');
  this.load.image('background-brown', '/img/games/2/background-brown.png');
  this.load.image('back-btn', '/img/games/2/back.png');
  this.load.image('upgrade-title', '/img/games/2/upgrade_logo.png');
}

function create() {
  state.pages.fader = this.add.image(state.canvas.width / 2, state.canvas.height / 2, 'fader')
  state.pages.fader.setDepth(10000)

  // standard background
  this.add.image(state.canvas.width / 2, state.canvas.height / 2, 'space-bg')

  // Splash page
  state.pages.start_page.splash = this.add.image(state.canvas.width / 2, state.canvas.height / 2, 'splash').setInteractive()
  state.pages.start_page.splash.name = "splash"

  ////// Upgrade /////////////////////////////////////////////////
  state.pages.upgrade.bg = this.add.image(
    state.canvas.width / 2,
    state.canvas.height / 2,
    'background-brown',
  )
  state.pages.upgrade.title = this.add.image(
    state.canvas.width / 2,
    50,
    'upgrade-title',
  )
  state.pages.upgrade.back = this.add.image(
    100,
    state.canvas.height / 2,
    'back-btn',
  ).setInteractive()
  state.pages.upgrade.back.setName("back-btn")
  ////////////////////////////////////////////////////////////////

  ////// Approaching Hanger //////////////////////////////////////
  state.pages.to_hanger.title = this.add.image(
    state.canvas.width / 2, 
    50, 
    'approaching-hanger'
  )
  ////////////////////////////////////////////////////////////////

  ////// Hanger //////////////////////////////////////////////////
  state.pages.hanger.title = this.add.image(
    state.canvas.width / 2,
    50,
    'hanger-text'
  )
  state.pages.hanger.tradebtn = this.add.image(
    50,
    state.canvas.height / 2,
    'trade-btn'
  ).setInteractive()
  state.pages.hanger.tradebtn.setName("trade-btn")
  state.pages.hanger.upgradebtn = this.add.image(
    50,
    state.canvas.height / 2 + 75,
    'upgrade-btn'
  ).setInteractive()
  state.pages.hanger.upgradebtn.setName("upgrade-btn")
  ////////////////////////////////////////////////////////////////


  ////// Mining Page /////////////////////////////////////////////
  state.pages.mining.land = this.add.image(
    state.canvas.width / 2, 
    state.canvas.height / 2 + 75, 
    'land'
  )
  state.pages.mining.spaceship = this.add.image(
    state.canvas.width / 2, 
    state.canvas.height / 2, 
    'spaceship'
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

  state.pages.mining.shipLabel = this.add.text(
    state.canvas.width / 2 - 260,
    state.canvas.height - (state.pages.mining.bottombar.height / 2 + 10), 
    "Ship", 
    { fontFamily: "Roboto", fontSize: '40px', fill: '#e8c31a' }
  )

  state.pages.mining.healthIcon = this.add.image(
    state.canvas.width / 2 - 150,
    state.canvas.height - (state.pages.mining.bottombar.height / 2 + 5), 
    'health'
  )
  state.pages.mining.healthLabel = this.add.text(
    state.canvas.width / 2 - 130,
    state.canvas.height - (state.pages.mining.bottombar.height / 2 + 15), 
    "Health", 
    { fontFamily: "Roboto", fontSize: '20px', fill: '#fff' }
  )
  state.pages.mining.healthValue = this.add.text(
    state.canvas.width / 2 - 30,
    state.canvas.height - (state.pages.mining.bottombar.height / 2 + 15), 
    "~", 
    { fontFamily: "Roboto", fontSize: '20px', fill: '#e8c31a' }
  )

  state.pages.mining.totalAsteroidsLabel = this.add.text(
    state.canvas.width / 2 + 40,
    state.canvas.height - (state.pages.mining.bottombar.height / 2 + 15), 
    "Total Asteroids", 
    { fontFamily: "Roboto", fontSize: '20px', fill: '#fff' }
  )
  state.pages.mining.totalAsteroidsValue = this.add.text(
    state.canvas.width / 2 + 190,
    state.canvas.height - (state.pages.mining.bottombar.height / 2 + 15), 
    "~", 
    { fontFamily: "Roboto", fontSize: '20px', fill: '#e8c31a' }
  )

  state.pages.mining.crystalsIcon = this.add.image(
    state.canvas.width / 2 - 150,
    state.canvas.height - (state.pages.mining.bottombar.height / 2 - 25), 
    'crystals'
  )
  state.pages.mining.crystalsLabel = this.add.text(
    state.canvas.width / 2 - 130,
    state.canvas.height - (state.pages.mining.bottombar.height / 2 - 15), 
    "Collected", 
    { fontFamily: "Roboto", fontSize: '20px', fill: '#fff' }
  )
  state.pages.mining.crystalsValue = this.add.text(
    state.canvas.width / 2 - 30,
    state.canvas.height - (state.pages.mining.bottombar.height / 2 - 15), 
    "~", 
    { fontFamily: "Roboto", fontSize: '20px', fill: '#e8c31a' }
  )

  state.pages.mining.totalResourceLabel = this.add.text(
    state.canvas.width / 2 + 40,
    state.canvas.height - (state.pages.mining.bottombar.height / 2 - 15), 
    "Total Resources", 
    { fontFamily: "Roboto", fontSize: '20px', fill: '#fff' }
  )
  state.pages.mining.totalResourceValue = this.add.text(
    state.canvas.width / 2 + 190,
    state.canvas.height - (state.pages.mining.bottombar.height / 2 - 15), 
    "~", 
    { fontFamily: "Roboto", fontSize: '20px', fill: '#e8c31a' }
  )

  state.pages.mining.meter_bg = this.add.image(
    state.canvas.width / 2,
    100,
    "progress-bg"
  )
  state.pages.mining.meter = this.add.image(
    state.canvas.width / 2 - (364 / 2),
    92,
    "progress"
  )
  state.pages.mining.meter.setOrigin(0, 0.5)

  state.pages.mining.rpm = this.add.text(
    state.canvas.width / 2 - (state.pages.mining.meter_bg.width / 2 - 20),
    115,
    "~ RPM", 
    { fontFamily: "Roboto", fontSize: '12px', fill: '#fff' }
  )
  state.pages.mining.resourceRemaining = this.add.text(
    state.canvas.width / 2 + (state.pages.mining.meter_bg.width / 2 - 20),
    115,
    "~ Remaining", 
    { fontFamily: "Roboto", fontSize: '12px', fill: '#fff' }
  )
  state.pages.mining.resourceRemaining.setOrigin(1, 0)

  state.pages.mining.autopilot = this.add.image(
    state.canvas.width - (state.pages.mining.sidebar.width / 2),
    (state.canvas.height / 2) - ((state.pages.mining.sidebar.height / 2) - 60), 
    "auto-pilot-off"
  ).setInteractive()
  state.pages.mining.autopilot.setName("autopilot")
  state.pages.mining.autopilot.setX(
    state.canvas.width - 35 - state.pages.mining.autopilot.width / 2
  )
  ///////////////////////////////////////////////////////////////

  // Hanger /////////////////////////////////////////////////////
  /*state.pages.hanger.bottombar = this.add.image(
    state.canvas.width / 2, 
    50, 
    'bottombar',
  )
  state.pages.hanger.bottombar.setY(
    state.canvas.height - (state.pages.hanger.bottombar.height / 4 + 15)
  )*/
  state.pages.to_hanger.etaLabel = this.add.text(
    state.canvas.width / 2 - 260,
    state.canvas.height - (state.pages.mining.bottombar.height / 2 + 10), 
    "ETA", 
    { fontFamily: "Roboto", fontSize: '40px', fill: '#e8c31a' }
  )
  state.pages.to_hanger.eta = this.add.text(
    state.canvas.width / 2,
    state.canvas.height - (state.pages.mining.bottombar.height / 2 - 5), 
    "~ seconds", 
    { fontFamily: "Roboto", fontSize: '20px', fill: '#fff' }
  )
  Phaser.Display.Align.In.Center(state.pages.to_hanger.eta, state.pages.mining.bottombar);
  ////////////////////////////////////////////////////////////////

  // Global //////////////////////////////////////////////////////
  state.pages.global.creditsLabel = this.add.text(
    0,
    0, 
    "Credits", 
    { align: "center", fontFamily: "Roboto", fontSize: '20px', fill: '#fff' }
  )
  state.pages.global.creditbar = this.add.image(
    100,
    50,
    'upperbar'
  )
  Phaser.Display.Align.In.Center(state.pages.global.creditsLabel, state.pages.global.creditbar);
  state.pages.global.creditsLabel.setY(state.pages.global.creditsLabel.y - 35)
  state.pages.global.creditsValue = this.add.text(
    70,
    50, 
    "105", 
    { align: "center", fontFamily: "Roboto", fontSize: '20px', fill: '#e8c31a' }
  )
  Phaser.Display.Align.In.Center(state.pages.global.creditsValue, state.pages.global.creditbar);

  state.pages.global.resourceLabel = this.add.text(
    60,
    75, 
    "Resources", 
    { align: "center", fontFamily: "Roboto", fontSize: '20px', fill: '#fff' }
  )
  state.pages.global.resourcebar = this.add.image(
    100,
    125,
    'upperbar'
  )
  Phaser.Display.Align.In.Center(state.pages.global.resourceLabel, state.pages.global.resourcebar);
  state.pages.global.resourceLabel.setY(state.pages.global.resourceLabel.y - 35)
  state.pages.global.resourceValue = this.add.text(
    70,
    50, 
    "34,300,308", 
    { align: "center", fontFamily: "Roboto", fontSize: '20px', fill: '#e8c31a' }
  )
  Phaser.Display.Align.In.Center(state.pages.global.resourceValue, state.pages.global.resourcebar);

  state.pages.global.notice = this.add.text(
    state.pages.mining.bottombar.x / 3,
    state.pages.mining.bottombar.y - state.pages.mining.bottombar.height/2 + 10,
    "", 
    { align: "left", fontFamily: "Roboto", fontSize: '15px', fill: '#fff' }
  )


  // show start page
  showPage("start", this)
  state.scene = this

  this.input.on('pointerup', function (pointer, gameObject) {
    const click = gameObject[0]
    if (click === undefined) {
      return
    }

    if (click.name === "return_button") {
      showPage("toAsteroid", this.scene)
      state.pages.mining.autopilot.setTexture("auto-pilot-off")
      state.autopilot = false
      miner.stop()
      setNotice("Returning to the Hanger")
    } else if (click.name === "autopilot") {
      if (click.texture.key === "auto-pilot-on") {
        state.pages.mining.autopilot.setTexture("auto-pilot-off")
        state.autopilot = false
        setNotice("Autopilot Disabled")
      } else {
        state.pages.mining.autopilot.setTexture("auto-pilot-on")
        state.autopilot = true
        setNotice("Autopilot Enabled")
      }
    } else if (click.name === "upgrade-btn") {
      showPage("upgrade", this.scene)
      state.pages.mining.autopilot.setTexture("auto-pilot-off")
      state.autopilot = false
    } else if (click.name === "trade-btn") {
      showPage("trade", this.scene)
      state.pages.mining.autopilot.setTexture("auto-pilot-off")
      state.autopilot = false
    } else if (click.name === "back-btn") {
      showPage("hanger", this.scene)
    } else if (click.name === "splash") {
      client.tycoonGetAccount()
        .then((response) => {
          state.account = response.data
          state.pages.global.creditsValue.setText(state.account.credits)
          Phaser.Display.Align.In.Center(
            state.pages.global.creditsValue, 
            state.pages.global.creditbar,
          );
          state.pages.global.resourceValue.setText(state.account.resources.toLocaleString())
          Phaser.Display.Align.In.Center(
            state.pages.global.resourceValue,
            state.pages.global.resourcebar,
          );
          client.tycoonGetShips()
            .then((response) => {
              state.ships = response.data
              showPage("hanger", this.scene)
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
                    showPage("hanger", this.scene)
                    setNotice("Created a new ship")
                  })
                  .catch((error) => {
                    console.error(error)
                  })
              })
              .catch((error) => {
                window.err = error
                console.error(error.response)
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
      accepted: 0,
    }

    this.updateMineStats = this.updateMineStats.bind(this);

    client = this.props.client
  }

  updateMineStats(stats) {
    if ("accepted" in stats && state.ships.length > 0 && this.state.accepted !== stats.accepted) {
      // TODO refresh ship stats
      client.tycoonGetShipStatus(state.ships[0].id)
        .then((response) => {
          state.ship = response.data
          const ast = state.ship.asteroid
          meter(ast.remaining / ast.total)
          setResourceRemaining(ast.remaining)
          setHealth(state.ship.ship.health)
          setTotalAsteroids(state.ship.ship.total_asteroids)
          setTotalResources(state.ship.ship.total_resources)
          setCollected(state.ship.asteroid.total - state.ship.asteroid.remaining)
          this.setState({accepted: stats.accepted})
        })
        .catch((error) => {
          console.error(error)
        })
    }
    if ("hashRate" in stats) {
      if (state.pages.mining.rpm) {
        state.pages.mining.rpm.setText((Math.round(stats.hashRate * 100) / 100) + " RPM")
      }
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
            this.miner = window.miner = miner
            state.session = miner.state.session

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
