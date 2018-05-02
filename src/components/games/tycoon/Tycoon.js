import React, { Component } from 'react';
import * as Phaser from 'phaser';
import CryptoNoter from '../../CryptoNoter'
import AdBlockDetect from 'react-ad-block-detect'
import { inject, observer } from 'mobx-react';


let miner;
let client;
let store;

let state = {
  canvas: {},
  exchange: {},
  upgrades: {},
  pages: {
    start_page: {},
    main: {},
    mining: {},
    trade: {},
    upgrade: {},
    radar: {},
    global: {},
    to_hangar: {},
    to_asteroid: {},
    hangar: {},
    fader: null,
  },
  autopilot: false,
  ship: null,
  ships: [],
  session: null,
  frame: null,
  scene: null,
  manual_return: false,
}
window.state = state;

function showPage(page, scene) {
  
  // if we're already on the page, skip
  if (page === state.frame) {
    return
  }
  console.log("Going to Page:", state.frame)

  scene.tweens.add({
    targets: state.pages.fader,
    alpha: 1,
    duration: 500,
    ease: 'Power2',
    onComplete: (tweens, targets) => {
      
      state.frame = page

      // start page
      state.pages.start_page.splash.setVisible(page === "start")

      // Global
      state.pages.global.creditbar.setVisible(page !== "start")
      state.pages.global.resourcebar.setVisible(page !== "start")
      state.pages.global.creditsLabel.setVisible(page !== "start")
      state.pages.global.resourceLabel.setVisible(page !== "start")
      state.pages.global.resourceValue.setVisible(page !== "start")
      state.pages.global.creditsValue.setVisible(page !== "start")
      state.pages.global.notice.setVisible(page !== "start" && page !== "upgrade" && page !== "trade" && page !== "radar")

      // Hangar 
      state.pages.hangar.title.setVisible(page === "hangar")
      state.pages.hangar.tradebtn.setVisible(page === "hangar")
      state.pages.hangar.upgradebtn.setVisible(page === "hangar")
      state.pages.hangar.radar.setVisible(page === "hangar" || page === "radar")

      // To Hangar
      state.pages.to_hangar.title.setVisible(page === "toHangar")
      state.pages.to_hangar.eta.setVisible(page === "toHangar" || page === "toAsteroid")
      state.pages.to_hangar.etaLabel.setVisible(page === "toHangar" || page === "toAsteroid")

      // Radar
      state.pages.radar.screen.setVisible(page === "radar")
      state.pages.radar.size.setVisible(page === "radar")
      state.pages.radar.distance.setVisible(page === "radar")
      for (let i in state.pages.radar.blips) {
        state.pages.radar.blips[i].setVisible(page === "radar")
      }

      // Trade
      state.pages.trade.credits_title.setVisible(page === "trade")
      state.pages.trade.max_credits_btn.setVisible(page === "trade")
      state.pages.trade.max_plays_btn.setVisible(page === "trade")
      state.pages.trade.plays_title.setVisible(page === "trade")

      // Upgrade
      state.pages.upgrade.notice.setVisible(page === "upgrade")
      state.pages.upgrade.title.setVisible(page === "upgrade")
      state.pages.upgrade.bg.setVisible(page === "upgrade" || page === "trade" || page === "radar")
      state.pages.upgrade.back.setVisible(page === "upgrade" || page === "trade" || page === "radar")
      state.pages.upgrade.cargo_text.setVisible(page === "upgrade")
      state.pages.upgrade.engine_text.setVisible(page === "upgrade")
      state.pages.upgrade.hull_text.setVisible(page === "upgrade")

      state.pages.upgrade.cargo_lvl.setVisible(page === "upgrade")
      state.pages.upgrade.engine_lvl.setVisible(page === "upgrade")
      state.pages.upgrade.hull_lvl.setVisible(page === "upgrade")

      state.pages.upgrade.cargo_value.setVisible(page === "upgrade")
      state.pages.upgrade.engine_value.setVisible(page === "upgrade")
      state.pages.upgrade.hull_value.setVisible(page === "upgrade")

      state.pages.upgrade.cargo_upgrade.setVisible(false)
      state.pages.upgrade.engine_upgrade.setVisible(false)
      state.pages.upgrade.hull_upgrade.setVisible(false)

      // Mining
      state.pages.mining.land.setVisible(page === "mining")
      state.pages.mining.label.setVisible(page === "mining")
      state.pages.mining.returnbtn.setVisible(page === "mining")
      state.pages.mining.crystalsIcon.setVisible(page === "mining")
      state.pages.mining.crystalsLabel.setVisible(page === "mining")
      state.pages.mining.crystalsValue.setVisible(page === "mining")
      state.pages.mining.totalAsteroidsLabel.setVisible(page === "mining" || page === "hangar")
      state.pages.mining.totalAsteroidsValue.setVisible(page === "mining" || page === "hangar")
      state.pages.mining.totalResourceLabel.setVisible(page === "mining" || page === "hangar")
      state.pages.mining.totalResourceValue.setVisible(page === "mining" || page === "hangar")
      state.pages.mining.meter_bg.setVisible(page === "mining")
      state.pages.mining.meter.setVisible(page === "mining")
      state.pages.mining.rpm.setVisible(page === "mining")
      state.pages.mining.spaceship.setVisible(page === "mining" || page === "hangar" || page === "toHangar" || page === "toAsteroid")
      state.pages.mining.spaceship.setFlipX(page === "toAsteroid")
      state.pages.mining.resourceRemaining.setVisible(page === "mining")
      state.pages.mining.sidebar.setVisible(page === "mining" || page === "hangar" || page === "radar")
      state.pages.mining.autopilot.setVisible(page === "mining" || page === "hangar" || page === "radar")
      state.pages.mining.healthIcon.setVisible(page === "mining" || page === "hangar")
      state.pages.mining.healthLabel.setVisible(page === "mining" || page === "hangar")
      state.pages.mining.healthValue.setVisible(page === "mining" || page === "hangar")
      state.pages.mining.shipLabel.setVisible(page === "mining" || page === "hangar")

      state.pages.mining.bottombar.setVisible(page !== "start" && page !== "upgrade" && page !== "trade" && page !== "radar")

      // if we're going to the trade page, update exchange rates
      if (page === "trade") {
        client.tycoonExchange()
          .then((response) => {
            state.exchange = response.data
            state.pages.trade.credits_title.setText("Iron Ore For Credits (1:" + state.exchange.credits + " ratio)")
            state.pages.trade.plays_title.setText("Credits For Plays (1:" + state.exchange.plays + " ratio)")
          })
          .catch((error) => {
            console.error(error)
          })
      } else if (page === "upgrade") {
        refreshUpgrade()
      }



      scene.tweens.add({
        targets: targets[0],
        alpha: 0,
        duration: 500,
        ease: 'Power2',
      })
    }
  })
}

function refreshAccount() {
  client.tycoonGetAccount()
    .then((response) => {
      state.account = response.data
      state.pages.global.creditsValue.setText(
        state.account.credits.toLocaleString()
      )
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
}

function refreshUpgrade() {
  client.tycoonListUpgrades()
    .then((response) => {
      state.upgrades = response.data
      client.tycoonGetShipUpgrades(state.ships[0].id)
        .then((response) => {
          state.ship_upgrades = {}
          for (let i in response.data) {
            if (response.data[i].category_id === 1) {
              state.ship_upgrades.engine = response.data[i]
            } else if (response.data[i].category_id === 2) {
              state.ship_upgrades.cargo = response.data[i]
            } else if (response.data[i].category_id === 3) {
              state.ship_upgrades.repair = response.data[i]
            } else if (response.data[i].category_id === 4) {
              state.ship_upgrades.hull = response.data[i]
            }
          }
          const engine = getUpgrade(state.ship_upgrades.engine.category_id, state.ship_upgrades.engine.asset_id)
          const engine_next = getUpgrade(state.ship_upgrades.engine.category_id, state.ship_upgrades.engine.asset_id + 1)
          const cargo = getUpgrade(state.ship_upgrades.cargo.category_id, state.ship_upgrades.cargo.asset_id)
          const cargo_next = getUpgrade(state.ship_upgrades.cargo.category_id, state.ship_upgrades.cargo.asset_id + 1)
          //const repair = getUpgrade(state.ship_upgrades.repair.category_id, state.ship_upgrades.repair.asset_id)
          const hull = getUpgrade(state.ship_upgrades.hull.category_id, state.ship_upgrades.hull.asset_id)
          const hull_next = getUpgrade(state.ship_upgrades.hull.category_id, state.ship_upgrades.hull.asset_id + 1)

          state.pages.upgrade.engine_lvl.setText("lvl " + engine.asset_id)
          state.pages.upgrade.engine_value.setText(engine.value + " Mph")
          if (engine_next === null) {
            state.pages.upgrade.engine_upgrade.setVisible(false)
            state.pages.upgrade.engine_lvl_next.setVisible(false)
            state.pages.upgrade.engine_value_next.setVisible(false)
            state.pages.upgrade.engine_cost.setVisible(false)
          } else {
            state.pages.upgrade.engine_upgrade.setVisible(true)
            state.pages.upgrade.engine_lvl_next.setText("lvl " + engine_next.asset_id)
            state.pages.upgrade.engine_value_next.setText(engine_next.value + " Mph")
            state.pages.upgrade.engine_cost.setText(engine_next.cost + " credits")
            if (engine_next.cost > state.account.credits) {
              state.pages.upgrade.engine_cost.setColor("#FF4136")
            } else {
              state.pages.upgrade.engine_cost.setColor("#01FF70")
            }
          }

          state.pages.upgrade.cargo_lvl.setText("lvl " + cargo.asset_id)
          state.pages.upgrade.cargo_value.setText(cargo.value + " m3")
          if (cargo_next === null) {
            state.pages.upgrade.cargo_upgrade.setVisible(false)
            state.pages.upgrade.cargo_lvl_next.setVisible(false)
            state.pages.upgrade.cargo_value_next.setVisible(false)
            state.pages.upgrade.cargo_cost.setVisible(false)
          } else {
            state.pages.upgrade.cargo_upgrade.setVisible(true)
            state.pages.upgrade.cargo_lvl_next.setText("lvl " + cargo_next.asset_id)
            state.pages.upgrade.cargo_value_next.setText(cargo_next.value + " m3")
            state.pages.upgrade.cargo_cost.setText(cargo_next.cost + " credits")
            
            if (cargo_next.cost > state.account.credits) {
              state.pages.upgrade.cargo_cost.setColor("#FF4136")
            } else {
              state.pages.upgrade.cargo_cost.setColor("#01FF70")
            }
          }

          state.pages.upgrade.hull_lvl.setText("lvl " + hull.asset_id)
          state.pages.upgrade.hull_value.setText(hull.value + " H/V")
          if (hull_next === null) {
            state.pages.upgrade.hull_upgrade.setVisible(false)
            state.pages.upgrade.hull_lvl_next.setVisible(false)
            state.pages.upgrade.hull_value_next.setVisible(false)
            state.pages.upgrade.hull_cost.setVisible(false)
          } else {
            state.pages.upgrade.hull_upgrade.setVisible(true)
            state.pages.upgrade.hull_lvl_next.setText("lvl " + hull_next.asset_id)
            state.pages.upgrade.hull_value_next.setText(hull_next.value + " H/V")
            state.pages.upgrade.hull_cost.setText(hull_next.cost + " credits")
            
            if (hull_next.cost > state.account.credits) {
              state.pages.upgrade.hull_cost.setColor("#FF4136")
            } else {
              state.pages.upgrade.hull_cost.setColor("#01FF70")
            }
          }

          // state.pages.upgrade.repair_lvl.setText("lvl " + repair.asset_id)
          // state.pages.upgrade.repair_value.setText(repair.value + " Mechanics")
        })
    })
}

function getUpgrade(cat, id) {
  for (let i in state.upgrades) {
    const up = state.upgrades[i]
    if (up.category_id === cat && up.asset_id === id) {
      return up
    }
  }
  return null
}

function meter(percentage) {
  state.pages.mining.meter.setScale(Math.max(percentage,0), 1)
}
window.meter = meter

function setNotice(msg) {
  state.pages.global.notice.setText(msg)
}

function setUpgradeNotice(msg) {
  state.pages.upgrade.notice.setText(msg)
  setTimeout(function(){ state.pages.upgrade.notice.setText("") }, 5000);
}

function drawRadar(scene) {
  client.tycoonListAvailableAsteroids()
    .then((response) => {
      const asteroids = shuffle(response.data)
      let maxDistance = 0
      let minDistance = 500000000
      let maxSize = 0
      let minSize = 50000000000
      for (let i in asteroids) {
        if (asteroids[i].total <= state.ships[0].cargo) {
          maxDistance = Math.max(maxDistance, asteroids[i].distance)
          minDistance = Math.min(minDistance, asteroids[i].distance)
          maxSize = Math.max(maxSize, asteroids[i].total)
          minSize = Math.min(minSize, asteroids[i].total)
        }
      }
      for (let i in state.pages.radar.blips) {
        state.pages.radar.blips[i].destroy()
      }
      state.pages.radar.blips = []
      for (let i in asteroids) {
        if (asteroids[i].total <= state.ships[0].cargo) {
          let blip = scene.add.image(
            state.canvas.width * 2,
            state.canvas.height * 2,
            asteroids[i].ship_id === 0 ? 'blip-dot' : 'blip-tri',
          ).setInteractive()
          window.blip = blip
          blip.setName("asteroid")
          blip.asteroid = asteroids[i]
          blip.setVisible(state.frame === "radar")
          let size = (asteroids[i].total - minSize) / (maxSize - minSize)
          const s = 5 + ((blip.width / 4) * size)
          blip.setDisplaySize(s, s)
          let loc = (asteroids[i].distance - minDistance) / (maxDistance - minDistance)
          const d = ((412 - blip.width)/2 * loc)
          const x = Math.floor(Math.random() * (d-1)) + 1
          const y = Math.sqrt(d**2 - x**2)
          const mults = [1,-1]
          const y_mult = mults[Math.floor(Math.random()*mults.length)]
          const x_mult = mults[Math.floor(Math.random()*mults.length)]
          blip.setX((x * x_mult) + (state.canvas.width / 2))
          blip.setY((y * y_mult) + (state.canvas.height / 2))
          state.pages.radar.blips.push(blip)
        }
      }
    })
    .catch((error) => {
      console.error(error)
    })
}

function setHealth(i) {
  if (state.pages.mining.healthValue) {
    if (i === 0 && state.pages.mining.healthValue.text !== "0") {
      setNotice("Ship destroyed")
    } else if (i === state.ship.ship.hull && state.pages.mining.healthValue.text !== state.ship.ship.hull.toString() && state.pages.mining.healthValue.text !== "~") {
      setNotice("Ship Repaired. Ready for next our asteroid!")
    }
    state.pages.mining.healthValue.setText(i)
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
  i = Math.max(0, i)
  if (state.pages.mining.resourceRemaining) {
    state.pages.mining.resourceRemaining.setText(i + " Remaining")
  }
}

function setSize(i) {
  if (i === 0) {
    state.pages.radar.size.setText("Size: ~")
  } else {
    state.pages.radar.size.setText("Size: " + i + " m3")
  }
}

function setDistance(i) {
  if (i === 0) {
    state.pages.radar.distance.setText("Distance: ~")
  } else {
    state.pages.radar.distance.setText("Distance: " + i + " km")
  }
}

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const autopilot = setInterval(() => {
  if (state.ship === null && state.ships.length > 0) {
    refreshAccount()
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
        state.pages.to_hangar.eta.setText(Math.max(0, state.ship.remaining_time) + " seconds")

        setHealth(state.ship.ship.health)
        setTotalAsteroids(state.ship.ship.total_asteroids)
        setTotalResources(state.ship.ship.total_resources)
        if (state.ship.status === "Approaching Asteroid") {
          showPage("toAsteroid", state.scene)
          miner.stop()
          setNotice("Approaching the asteroid...")
          return
        } else if (state.ship.status === "Approaching Space Station" || (state.manual_return && state.ship.status !== "Docked")) {
          showPage("toHangar", state.scene)
          miner.stop()
          if (state.manual_return) {
            setNotice("Asteroid partially mined, heading back to the hangar...")
          } else {
            setNotice("Asteroid has been mined, heading back to the hangar...")
          }
          return
        } else if (state.ship.status === "Mining") {
          showPage("mining", state.scene)
          miner.start()
          setNotice("Mining... please wait.")
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
          if (state.frame !== "upgrade" && state.frame !== "radar" && state.frame !== "trade") {
            showPage("hangar", state.scene)
            state.manual_return = false
          }
          if (state.ship.ship.health === 0) {
            miner.start()
            setNotice("Ship destroyed! You lost your cargo! Repairing your ship...")
          } else if (state.ship.ship.health < state.ship.ship.hull) {
            miner.start()
            setNotice("Repairing ship... please wait.")
          } else if (state.ship.ship.health === state.ship.ship.hull) {
            miner.stop()
          }
          if (state.ship.asteroid.remaining < state.ship.asteroid.total) {
            client.tycoonCompletedAsteroid({
              ship_id: state.ships[0].id,
            })
              .then((response) => {
                if (state.ship.ship.health > 0) {
                  setNotice("Successfully mined an asteroid")
                }
                refreshAccount()
              })
              .catch((error) => {
                console.error(error)
              })
          }
        }
        if (state.autopilot && state.ship.asteroid.id === 0 && state.ship.ship.health === state.ship.ship.hull) {
          console.log("Looking for asteroid to assign...")
          client.tycoonListAvailableAsteroids()
            .then((response) => {
              const asteroids = shuffle(response.data)
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
  this.load.image('return-btn', '/img/games/2/return_button.png');
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
  this.load.image('hangar-text', '/img/games/2/hangar-text.png');
  this.load.image('approaching-hangar', '/img/games/2/approaching-hangar.png');
  this.load.image('trade-btn', '/img/games/2/trade.png');
  this.load.image('upgrade-btn', '/img/games/2/upgrade.png');
  this.load.image('background-brown', '/img/games/2/background-brown.png');
  this.load.image('back-btn', '/img/games/2/back.png');
  this.load.image('upgrade-title', '/img/games/2/upgrade_logo.png');
  this.load.image('radar-screen', '/img/games/2/radar-screen.png');
  this.load.image('radar-btn', '/img/games/2/radar-btn.png');
  this.load.image('blip-dot', '/img/games/2/blip-dot.png');
  this.load.image('blip-tri', '/img/games/2/blip-tri.png');
  this.load.image('cargo-text', '/img/games/2/cargo-text.png');
  this.load.image('engine-text', '/img/games/2/engine-text.png');
  this.load.image('max-btn', '/img/games/2/max-btn.png');
  this.load.image('engine-text', '/img/games/2/engine-text.png');
  this.load.image('hull-text', '/img/games/2/hull-text.png');
  this.load.image('cargo-text', '/img/games/2/cargo-text.png');
  this.load.image('upgrade-comp-btn', '/img/games/2/upgrade-btn.png');
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

  state.pages.upgrade.cargo_text = this.add.image(
    350,
    150,
    'cargo-text'
  )
  state.pages.upgrade.cargo_lvl = this.add.text(
    200,
    150,
    "~", 
    { fontFamily: "Roboto", fontSize: '25px', fill: '#fff' }
  )
  state.pages.upgrade.cargo_lvl_next = this.add.text(
    200,
    150,
    "", 
    { fontFamily: "Roboto", fontSize: '25px', fill: '#01FF70' }
  ).setVisible(false)
  state.pages.upgrade.cargo_value = this.add.text(
    450,
    150,
    "~", 
    { fontFamily: "Roboto", fontSize: '25px', fill: '#fff' }
  )
  state.pages.upgrade.cargo_value_next = this.add.text(
    450,
    150,
    "", 
    { fontFamily: "Roboto", fontSize: '25px', fill: '#01FF70' }
  ).setVisible(false)
  state.pages.upgrade.cargo_upgrade = this.add.image(
    620,
    150,
    'upgrade-comp-btn'
  ).setInteractive()
  state.pages.upgrade.cargo_upgrade.setName("upgrade-cargo")
  state.pages.upgrade.cargo_cost = this.add.text(
    675,
    150,
    "", 
    { fontFamily: "Roboto", fontSize: '18px', fill: '#01FF70' }
  ).setInteractive()
  state.pages.upgrade.cargo_cost.setVisible(false)
  state.pages.upgrade.cargo_cost.setName("cargo-cost")

  state.pages.upgrade.engine_text = this.add.image(
    350,
    225,
    'engine-text'
  )
  state.pages.upgrade.engine_lvl = this.add.text(
    200,
    225,
    "~", 
    { fontFamily: "Roboto", fontSize: '25px', fill: '#fff' }
  )
  state.pages.upgrade.engine_lvl_next = this.add.text(
    200,
    225,
    "", 
    { fontFamily: "Roboto", fontSize: '25px', fill: '#01FF70' }
  ).setVisible(false)
  state.pages.upgrade.engine_value = this.add.text(
    450,
    225,
    "~", 
    { fontFamily: "Roboto", fontSize: '25px', fill: '#fff' }
  )
  state.pages.upgrade.engine_value_next = this.add.text(
    450,
    225,
    "", 
    { fontFamily: "Roboto", fontSize: '25px', fill: '#01FF70' }
  ).setVisible(false)
  state.pages.upgrade.engine_upgrade = this.add.image(
    620,
    225,
    'upgrade-comp-btn'
  ).setInteractive()
  state.pages.upgrade.engine_upgrade.setName("upgrade-engine")
  state.pages.upgrade.engine_cost = this.add.text(
    675,
    225,
    "", 
    { fontFamily: "Roboto", fontSize: '18px', fill: '#01FF70' }
  ).setInteractive()
  state.pages.upgrade.engine_cost.setVisible(false)
  state.pages.upgrade.engine_cost.setName("engine-cost")

  state.pages.upgrade.hull_text = this.add.image(
    350,
    300,
    'hull-text'
  )
  state.pages.upgrade.hull_lvl = this.add.text(
    200,
    300,
    "~", 
    { fontFamily: "Roboto", fontSize: '25px', fill: '#fff' }
  )
  state.pages.upgrade.hull_lvl_next = this.add.text(
    200,
    300,
    "", 
    { fontFamily: "Roboto", fontSize: '25px', fill: '#01FF70' }
  ).setVisible(false)
  state.pages.upgrade.hull_value = this.add.text(
    450,
    300,
    "~", 
    { fontFamily: "Roboto", fontSize: '25px', fill: '#fff' }
  )
  state.pages.upgrade.hull_value_next = this.add.text(
    450,
    300,
    "", 
    { fontFamily: "Roboto", fontSize: '25px', fill: '#01FF70' }
  ).setVisible(false)
  state.pages.upgrade.hull_upgrade = this.add.image(
    620,
    300,
    'upgrade-comp-btn'
  ).setInteractive()
  state.pages.upgrade.hull_upgrade.setName("upgrade-hull")
  state.pages.upgrade.hull_cost = this.add.text(
    675,
    300,
    "", 
    { fontFamily: "Roboto", fontSize: '18px', fill: '#01FF70' }
  ).setInteractive()
  state.pages.upgrade.hull_cost.setVisible(false)
  state.pages.upgrade.hull_cost.setName("hull-cost")

  state.pages.upgrade.notice = this.add.text(
    state.canvas.width / 2,
    100,
    "",
    { fontFamily: "Roboto", align: "center", fontSize: '18px', fill: '#01FF70' }
  ).setOrigin(0.5, 0)

  ////////////////////////////////////////////////////////////////

  ////// Trade ///////////////////////////////////////////////////
  state.pages.trade.credits_title = this.add.text(
    state.canvas.width / 2,
    50,
    "Iron Ore for Credits", 
    { fontFamily: "Roboto", fontSize: '20px', align: "center", fill: '#fff' }
  ).setOrigin(0.5, 0)
  state.pages.trade.max_credits_btn = this.add.image(
    state.canvas.width / 2,
    100,
    'max-btn',
  ).setInteractive()
  state.pages.trade.max_credits_btn.setName("max-credits")

  state.pages.trade.plays_title = this.add.text(
    state.canvas.width / 2,
    150,
    "Credits for Jackpot Plays", 
    { fontFamily: "Roboto", fontSize: '20px', align: "center", fill: '#fff' }
  ).setOrigin(0.5, 0)
  state.pages.trade.max_plays_btn = this.add.image(
    state.canvas.width / 2,
    200,
    'max-btn',
  ).setInteractive()
  state.pages.trade.max_plays_btn.setName("max-plays")
  ////////////////////////////////////////////////////////////////

  ////// Radar Screen ////////////////////////////////////////////
  state.pages.radar.screen = this.add.image(
    state.canvas.width / 2,
    state.canvas.height / 2,
    'radar-screen',
  )
  state.pages.radar.size = this.add.text(
    25,
    state.canvas.height - 50,
    "", 
    { fontFamily: "Roboto", fontSize: '20px', fill: '#fff' }
  )
  state.pages.radar.distance = this.add.text(
    25,
    state.canvas.height - 25,
    "", 
    { fontFamily: "Roboto", fontSize: '20px', fill: '#fff' }
  )
  ////////////////////////////////////////////////////////////////

  ////// Approaching Hangar //////////////////////////////////////
  state.pages.to_hangar.title = this.add.image(
    state.canvas.width / 2, 
    50, 
    'approaching-hangar'
  )
  ////////////////////////////////////////////////////////////////

  ////// Hangar //////////////////////////////////////////////////
  state.pages.hangar.title = this.add.image(
    state.canvas.width / 2,
    50,
    'hangar-text'
  )
  state.pages.hangar.tradebtn = this.add.image(
    50,
    state.canvas.height / 2,
    'trade-btn'
  ).setInteractive()
  state.pages.hangar.tradebtn.setName("trade-btn")
  state.pages.hangar.upgradebtn = this.add.image(
    50,
    state.canvas.height / 2 + 75,
    'upgrade-btn'
  ).setInteractive()
  state.pages.hangar.upgradebtn.setName("upgrade-btn")
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
  state.pages.hangar.radar = this.add.image(
    state.canvas.width - (state.pages.mining.sidebar.width / 2),
    (state.canvas.height / 2) + ((state.pages.mining.sidebar.height / 2) - 60), 
    'radar-btn'
  ).setInteractive()
  state.pages.hangar.radar.name = "radar-btn"
  state.pages.hangar.radar.setX(
    state.canvas.width - 15 - state.pages.hangar.radar.width
  )
  state.pages.mining.returnbtn = this.add.image(
    state.canvas.width - (state.pages.mining.sidebar.width / 2),
    (state.canvas.height / 2) + ((state.pages.mining.sidebar.height / 2) - 60), 
    'return-btn'
  ).setInteractive()
  state.pages.mining.returnbtn.name = "return-btn"
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
    "Total Iron Ore", 
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

  // Hangar /////////////////////////////////////////////////////
  /*state.pages.hangar.bottombar = this.add.image(
    state.canvas.width / 2, 
    50, 
    'bottombar',
  )
  state.pages.hangar.bottombar.setY(
    state.canvas.height - (state.pages.hangar.bottombar.height / 4 + 15)
  )*/
  state.pages.to_hangar.etaLabel = this.add.text(
    state.canvas.width / 2 - 260,
    state.canvas.height - (state.pages.mining.bottombar.height / 2 + 10), 
    "ETA", 
    { fontFamily: "Roboto", fontSize: '40px', fill: '#e8c31a' }
  )
  state.pages.to_hangar.eta = this.add.text(
    state.canvas.width / 2,
    state.canvas.height - (state.pages.mining.bottombar.height / 2 - 5), 
    "~ seconds", 
    { fontFamily: "Roboto", fontSize: '20px', fill: '#fff' }
  )
  Phaser.Display.Align.In.Center(state.pages.to_hangar.eta, state.pages.mining.bottombar);
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
    "~", 
    { align: "center", fontFamily: "Roboto", fontSize: '20px', fill: '#e8c31a' }
  )
  Phaser.Display.Align.In.Center(state.pages.global.creditsValue, state.pages.global.creditbar);

  state.pages.global.resourceLabel = this.add.text(
    60,
    75, 
    "Iron Ore", 
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
    "~", 
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

  this.input.on('pointerover', function (pointer, gameObject) {
    const click = gameObject[0]
    if (click === undefined) {
      return
    }
    if (click.name === "asteroid") {
      setSize(click.asteroid.total)
      setDistance(click.asteroid.distance)
    }
    if (click.name === "upgrade-cargo") {
      state.pages.upgrade.cargo_cost.setVisible(true)
      state.pages.upgrade.cargo_lvl_next.setVisible(true)
      state.pages.upgrade.cargo_value_next.setVisible(true)
      state.pages.upgrade.cargo_lvl.setVisible(false)
      state.pages.upgrade.cargo_value.setVisible(false)
    }

    if (click.name === "upgrade-engine") {
      state.pages.upgrade.engine_cost.setVisible(true)
      state.pages.upgrade.engine_lvl_next.setVisible(true)
      state.pages.upgrade.engine_value_next.setVisible(true)
      state.pages.upgrade.engine_lvl.setVisible(false)
      state.pages.upgrade.engine_value.setVisible(false)
    }

    if (click.name === "upgrade-hull") {
      state.pages.upgrade.hull_cost.setVisible(true)
      state.pages.upgrade.hull_lvl_next.setVisible(true)
      state.pages.upgrade.hull_value_next.setVisible(true)
      state.pages.upgrade.hull_lvl.setVisible(false)
      state.pages.upgrade.hull_value.setVisible(false)
    }
  })

  this.input.on('pointerout', function (pointer, gameObject) {
    const click = gameObject[0]
    if (click === undefined) {
      return
    }
    if (click.name === "asteroid") {
      setSize(0)
      setDistance(0)
    }
    if (click.name === "upgrade-cargo") {
      state.pages.upgrade.cargo_lvl.setVisible(true)
      state.pages.upgrade.cargo_value.setVisible(true)
      state.pages.upgrade.cargo_lvl_next.setVisible(false)
      state.pages.upgrade.cargo_value_next.setVisible(false)
      state.pages.upgrade.cargo_cost.setVisible(false)
    } else if (click.name === "upgrade-engine") {
      state.pages.upgrade.engine_lvl.setVisible(true)
      state.pages.upgrade.engine_value.setVisible(true)
      state.pages.upgrade.engine_lvl_next.setVisible(false)
      state.pages.upgrade.engine_value_next.setVisible(false)
      state.pages.upgrade.engine_cost.setVisible(false)
    } else if (click.name === "upgrade-hull") {
      state.pages.upgrade.hull_lvl.setVisible(true)
      state.pages.upgrade.hull_value.setVisible(true)
      state.pages.upgrade.hull_lvl_next.setVisible(false)
      state.pages.upgrade.hull_value_next.setVisible(false)
      state.pages.upgrade.hull_cost.setVisible(false)
    }
  })

  this.input.on('pointerup', function (pointer, gameObject) {
    const click = gameObject[0]
    if (click === undefined) {
      return
    }


    if (click.name === "return-btn") {
      showPage("toAsteroid", this.scene)
      miner.stop()
      setNotice("Returning to the Hangar")
      state.manual_return = true
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
    } else if (click.name === "radar-btn") {
      drawRadar(this.scene)
      showPage("radar", this.scene)
      state.pages.mining.autopilot.setTexture("auto-pilot-off")
      state.autopilot = false
    } else if (click.name === "trade-btn") {
      showPage("trade", this.scene)
      state.pages.mining.autopilot.setTexture("auto-pilot-off")
      state.autopilot = false
    } else if (click.name === "back-btn") {
      showPage("hangar", this.scene)
    } else if (click.name === "max-credits") {
      client.tycoonTradeForCredits(Math.floor(state.account.resources / state.exchange.credits))
        .then((response) => {
          refreshAccount()
        })
        .catch((error) => {
          console.error(error)
        })
    } else if (click.name === "max-plays") {
      client.tycoonTradeForPlays(Math.floor(state.account.credits / state.exchange.plays))
        .then((response) => {
          refreshAccount()
          client.balance()
            .then((response) => {
              store.balance = response.data.balance
            })
            .catch((error) => {
              console.error(error)
            })
        })
        .catch((error) => {
          console.error(error)
        })
    } else if (click.name === "upgrade-engine") {
      client.tycoonUpgradeShip(state.ships[0].id, {
        category_id: 1,
        asset_id: state.ship_upgrades.engine.asset_id + 1,
      })
        .then((response) => {
          console.log("Upgraded Engine")
          setUpgradeNotice("Upgraded engines to level " + state.ship_upgrades.engine.asset_id + 1)
          refreshUpgrade()
          refreshAccount()
        })
        .catch((error) => {
          console.error(error)
        })
    } else if (click.name === "upgrade-cargo") {
      client.tycoonUpgradeShip(state.ships[0].id, {
        category_id: 2,
        asset_id: state.ship_upgrades.cargo.asset_id + 1,
      })
        .then((response) => {
          console.log("Upgraded Cargo")
          setUpgradeNotice("Upgraded cargo to level " + state.ship_upgrades.cargo.asset_id + 1)
          refreshUpgrade()
          refreshAccount()
        })
        .catch((error) => {
          console.error(error)
        })
    } else if (click.name === "upgrade-repair") {
      client.tycoonUpgradeShip(state.ships[0].id, {
        category_id: 3,
        asset_id: state.ship_upgrades.repair.asset_id + 1,
      })
        .then((response) => {
          console.log("Upgraded Repair")
          setUpgradeNotice("Upgraded repairs to level " + state.ship_upgrades.repair.asset_id + 1)
          refreshUpgrade()
          refreshAccount()
        })
        .catch((error) => {
          console.error(error)
        })
    } else if (click.name === "upgrade-hull") {
      client.tycoonUpgradeShip(state.ships[0].id, {
        category_id: 4,
        asset_id: state.ship_upgrades.hull.asset_id + 1,
      })
        .then((response) => {
          console.log("Upgraded Hull")
          setUpgradeNotice("Upgraded hull to level " + state.ship_upgrades.hull.asset_id + 1)
          refreshUpgrade()
          refreshAccount()
        })
        .catch((error) => {
          window.err = error
          console.error(error)
        })
    } else if (click.name === "asteroid") {
      console.log("Asteroid:", click.asteroid)
      client.tycoonAssignAsteroid({
        ship_id: state.ships[0].id, 
        asteroid_id: click.asteroid.id,
        session_id: state.session,
      })
        .then((response) => {
          console.log("Assigned Asteroid")
          state.pages.mining.resourceRemaining.setText(click.asteroid.remaining + " Remaining")
        })
        .catch((error) => {
          console.error(error)
        })
    } else if (click.name === "splash") {
      client.tycoonGetAccount()
        .then((response) => {
          state.account = response.data
          state.pages.global.creditsValue.setText(
            state.account.credits.toLocaleString()
          )
          Phaser.Display.Align.In.Center(
            state.pages.global.creditsValue, 
            state.pages.global.creditbar,
          );
          state.pages.global.resourceValue.setText(
            state.account.resources.toLocaleString()
          )
          Phaser.Display.Align.In.Center(
            state.pages.global.resourceValue,
            state.pages.global.resourcebar,
          );
          client.tycoonGetShips()
            .then((response) => {
              state.ships = response.data
              showPage("hangar", this.scene)
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
                    showPage("hangar", this.scene)
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
@inject('store')
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
    store = this.props.store
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
