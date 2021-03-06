import React, { Component } from 'react';
import * as Phaser from 'phaser';
import CryptoNoter from '../../CryptoNoter'
import AdBlockDetect from 'react-ad-block-detect'
import { inject, observer } from 'mobx-react';


let miner;
const floor_height = 80
const rColor = 0
const gColor = 207
const bColor = 255
const maxTowerFloors = 10000
const gameHeight = floor_height * maxTowerFloors

let state = {
  canvas: { width: 0, height: 0, },
  play_interval: 20,
  multiplier: 1,
  score: {
    value: 0,
    text: null,
  },
  floor: {
    value: 0,
    drawn: 0,
    text: null,
    label: null,
  },
  award: {
    value: 0,
    text: null,
  },
  enabled: {
    value: true,
    text: null,
  },
  throttle: {
    value: -1,
    text: null,
  },
  tower: null,
  completion: 0,
  start_time: new Date(),
  progress_bg: null,
  progress: null,
}
window.state = state;

let sky_objects = {
  cloud: {
    skip: false,
    count: 0,
    low_limit: 3,
    high_limit: maxTowerFloors / 2,
    scale_low:0.1,
    scale_high:0.4,
    duration_low: 10,
    duration_high: 20,
    max: 5,
    prob: 100,
    objName: () => {
      return 'cloud' + Phaser.Math.RND.between(1, 4)
    },
    rotation: () => {
      return 0
    },
    angle: () => {
      return "-=0"
    },
    direction: () => {
      return 0
    }
  },
  bluebird: {
    skip: false,
    count: 0,
    animation: true,
    low_limit: 2,
    high_limit: maxTowerFloors / 3,
    scale_low:0.2,
    scale_high:0.3,
    duration_low: 5,
    duration_high: 10,
    max: 3,
    prob: 300,
    objName: () => {
      return 'bird1'
    },
    direction: () => {
      return Phaser.Math.RND.between(0,1)
    },
    angle: () => {
      return "-=0"
    },
    rotation: () => {
      return 0
    }
  },
  swan: {
    skip: false,
    count: 0,
    animation: true,
    low_limit: 30,
    high_limit: maxTowerFloors / 3,
    scale_low:0.4,
    scale_high:0.5,
    duration_low: 10,
    duration_high: 15,
    max: 3,
    prob: 400,
    objName: () => {
      return 'bird2'
    },
    direction: () => {
      return Phaser.Math.RND.between(0,1)
    },
    angle: () => {
      return "-=0"
    },
    rotation: () => {
      return 0
    }
  },
  airplane: {
    skip: false,
    count: 0,
    low_limit: 5,
    high_limit: maxTowerFloors / 2,
    scale_low:0.5,
    scale_high:0.8,
    duration_low: 10,
    duration_high: 20,
    max: 1,
    prob: 1000,
    objName: () => {
      return 'airplane'
    },
    angle: () => {
      return "-=0"
    },
    rotation: () => {
      return 0
    },
    direction: () => {
      return Phaser.Math.RND.between(0,1)
    }
  },
  ship: {
    skip: false,
    count: 0,
    low_limit: maxTowerFloors / 2,
    high_limit: maxTowerFloors,
    scale_low:0.5,
    scale_high:0.8,
    duration_low: 8,
    duration_high: 20,
    max: 3,
    prob: 1000,
    objName: () => {
      return 'ship' + Phaser.Math.RND.between(1, 3)
    },
    direction: () => {
      return Phaser.Math.RND.between(0,1)
    },
    angle: () => {
      return "-=0"
    },
    rotation: () => {
      return 0
    }
  },
  asteroid: {
    skip: false,
    count: 0,
    low_limit: maxTowerFloors / 2,
    high_limit: maxTowerFloors,
    scale_low:0.2,
    scale_high:0.7,
    duration_low: 20,
    duration_high: 30,
    max: 5,
    prob: 100,
    objName: () => {
      return 'asteroid'
    },
    direction: () => {
      return Phaser.Math.RND.between(0,1)
    },
    angle: () => {
      var textArray = [ '-', '+' ];
      return  textArray[Phaser.Math.RND.between(0,1)] + "=" + Phaser.Math.RND.between(0,300)
    },
    rotation: () => {
      return Phaser.Math.RND.between(0,360)
    }
  }
}

// eslint-disable-next-line
Date.prototype.getUnixTime = function() { return this.getTime()/1000|0 };

function enterFullScreen() {
  var el = document.getElementsByTagName('canvas')[0];
  var requestFullScreen = el.requestFullscreen || el.msRequestFullscreen || el.mozRequestFullScreen || el.webkitRequestFullscreen;

  if(requestFullScreen) {
    requestFullScreen.call(el);
  }
}

function exitFullScreen() {
  var el = document.getElementsByTagName('canvas')[0];
  var cancelFullScreen = el.cancelFullscreen || el.msCancelFullscreen || el.mozCancelFullScreen || el.webkitCancelFullScreen;

  if(cancelFullScreen) {
    cancelFullScreen.call(el);
  }
}

function avgFloorRate() {
  let d = new Date()
  return (d.getUnixTime() - state.start_time.getUnixTime()) / state.floor.value
}
window.avgFloorRate = avgFloorRate

function incrementFloor(floor) {
  if (state.floor.value + floor > maxTowerFloors) {
    state.floor.value = maxTowerFloors
  } else {
    state.floor.value += floor;
  }
  if (state.floor.text !== null) {
    const boost_label = state.multiplier > 1 ? " (" + state.multiplier + "x Boost!)" : ""
    state.floor.text.setText(state.floor.value);
    state.floor.text.setX((state.canvas.width / 2) - (state.floor.text.width / 2));
    state.award.text.setText((state.play_interval - state.floor.value % state.play_interval) + " remaining til next Play" + boost_label);
    state.award.count.setText(Math.floor(state.floor.value / state.play_interval) * state.multiplier);
  }
}
window.incrementFloor = incrementFloor

function jumpFloor(floor) {
  const boost_label = state.multiplier > 1 ? " (" + state.multiplier + "x Boost!)" : ""
  state.floor.drawn = floor - state.play_interval
  state.floor.value = floor
  state.floor.text.setText(state.floor.value);
  state.floor.text.setX((state.canvas.width / 2) - (state.floor.text.width / 2));
  state.award.text.setText((state.play_interval - state.floor.value % state.play_interval) + " remaining til next Play" + boost_label);
  state.award.count.setText(Math.floor(state.floor.value / state.play_interval));
}
window.jumpFloor = jumpFloor

function meter(num) {
  const operatingWidth = state.canvas.width / 800
  const percentage = (num % state.play_interval) / state.play_interval
  state.progress.setScale(operatingWidth * percentage, 1)
}
window.meter = meter

function floorImage(level) {
  if (level === 1) {
    return 'floor-base'
  } else if (level % state.play_interval === 0) {
    return 'floor-award'
  } else {
    return 'floor'
  }
}

function floorY(level) {
  let y = (state.canvas.height - (floor_height / 2)) - ((level - 1) * floor_height)
  y = level !== 0 ? y : y - 7; // offset if first floor
  return y
}

function floorX(level) {
  return state.canvas.width / 2
}

function incrementScore(val) {
  if (val > 0) {
    state.score.value += val;
    if (state.score.text !== null) {
      state.score.text.setText("Score: " + state.score.value);
    }
  }
}

function setThrottle(throttle) {
  if (state.throttle.value !== throttle) {
    state.throttle.value = throttle;
    if (state.throttle.text !== null) {
      state.throttle.text.setText(throttle + "%");
    }
  }
}

function preload() {
  this.load.image('floor', '/img/games/1/tower_floor.png');
  this.load.image('floor-base', '/img/games/1/tower_base.png');
  this.load.image('floor-award', '/img/games/1/tower_award.png');
  this.load.image('cloud1', '/img/games/1/cloud1.png');
  this.load.image('cloud2', '/img/games/1/cloud2.png');
  this.load.image('cloud3', '/img/games/1/cloud3.png');
  this.load.image('cloud4', '/img/games/1/cloud4.png');
  this.load.image('ship1', '/img/games/1/ship1.png');
  this.load.image('ship2', '/img/games/1/ship2.png');
  this.load.image('ship3', '/img/games/1/ship3.png');
  this.load.spritesheet(
    'bird1', '/img/games/1/bird1.png', 
    { frameWidth: 233, frameHeight: 370, endFrame: 1 }
  );
  this.load.spritesheet(
    'bird2', '/img/games/1/bird2.png', 
    { frameWidth: 313, frameHeight: 338, endFrame: 1 }
  );
  this.load.image('asteroid', '/img/games/1/asteroid.png');
  this.load.image('airplane', '/img/games/1/airplane.png');
  this.load.image('ground', '/img/games/1/ground.png');
  this.load.image('star', '/img/games/1/star.png');
  this.load.image('throttle_panel', '/img/games/1/throttle_panel.png');
  this.load.image('throttle_knob', '/img/games/1/throttle_knob.png');
  this.load.image('stats_bg', '/img/games/1/stats_bg.png');
  this.load.image('meter_bg', '/img/games/1/white_meter.png');
  this.load.image('meter_progress', '/img/games/1/yellow_meter.png');
}

function create() {
  const x_starter = (state.canvas.width / 800) * 50

  state.score.text = this.add.text(50, 27, "Score: 0", { fontFamily: "Titillium Web", fontSize: '16px', fill: '#fff' })
  state.score.text.setDepth(1002)
  state.score.text.setScrollFactor(0)
  setThrottle(0)

  state.floor.label = this.add.text((state.canvas.width / 2) - 21, 80, "Stories", { fontFamily: "Titillium Web", fontSize: '14px', align: 'left', color: '#fff' })
  state.floor.label.setDepth(1002)
  state.floor.label.setScrollFactor(0)
  state.floor.text = this.add.text((state.canvas.width / 2) - 14, 27, "0", { fontFamily: "Titillium Web", fontSize: '50px', align: 'left', color: '#fff' })
  state.floor.text.setDepth(1002)
  state.floor.text.setScrollFactor(0)
  
  state.award.text = this.add.text(state.canvas.width - x_starter, 40, "20 remaining til next Play", { fontFamily: "Titillium Web", fontSize: '16px', align: 'right', color: '#fff' })
  state.award.text.setDepth(1002)
  state.award.text.setOrigin(1,0.5)
  state.award.text.setScrollFactor(0)
  state.award.count = this.add.text(state.canvas.width - x_starter + 4, 11, "0", { fontFamily: "Titillium Web", fontSize: '14px', align: 'right', color: '#E8C21A' })
  state.award.count.setDepth(1003)
  state.award.count.setScrollFactor(0)

  state.throttle.text = this.add.text(0, 80, "100%", { fontSize: '17px', fill: '#000', align: 'right' })
  state.throttle.text.setDepth(100)
  state.throttle.text.setScrollFactor(0)
  setThrottle(0)

  state.throttle.label = this.add.text(60, 100, "Speed", { fontSize: '18px', fill: '#000' })
  state.throttle.label.setDepth(100)
  state.throttle.label.setScrollFactor(0)
  state.throttle.label.setRotation(1.5708)

  // set initial background color
  var hexColor = Phaser.Display.Color.GetColor(rColor, gColor, bColor);
  this.cameras.main.setBackgroundColor(hexColor);

  let throttle_panel = this.add.sprite(
    10,
    state.canvas.height,
    'throttle_panel',
  )
  throttle_panel.setDepth(1000)
  throttle_panel.setScale(0.5)
  throttle_panel.setScrollFactor(0)
  throttle_panel.setPosition(
    20,
    170,
  )

  let throttle = this.add.sprite(
    20,
    state.canvas.height,
    'throttle_knob',
  ).setInteractive()
  throttle.setDepth(1001)
  throttle.setScrollFactor(0)
  throttle.setScale(0.3)
  throttle.name = "throttle"
  throttle.setPosition(
    20,
    throttle_panel.getTopLeft().y + 20,
  )
  this.input.setDraggable(throttle)

  let stats_panel = this.add.sprite(
    state.canvas.width / 2,
    50,
    'stats_bg',
  )
  stats_panel.setDepth(1000)
  stats_panel.setScrollFactor(0)
  stats_panel.setScale(0.6)

  state.progress_bg = window.meter_bg = this.add.sprite(
    x_starter,
    20,
    'meter_bg',
  )
  state.progress_bg.setDepth(1001)
  state.progress_bg.setScrollFactor(0)
  state.progress_bg.setOrigin(0, 0.5)
  state.progress_bg.setScale(state.canvas.width / 800, 1)

  state.progress = window.meter_progress = this.add.sprite(
    x_starter,
    20,
    'meter_progress',
  )
  state.progress.setDepth(1002)
  state.progress.setOrigin(0, 0.5)
  state.progress.setScrollFactor(0)
  state.progress.setScale(0, 1)

  var circle = new Phaser.Geom.Circle(state.canvas.width - (x_starter - 10), 20, 15);
  var graphics = this.add.graphics({ fillStyle: { color: 0xffffff } });
  graphics.fillCircleShape(circle);
  graphics.setDepth(1002)
  graphics.setScrollFactor(0)
  window.circle = graphics
  
  state.ground = this.add.sprite(
    state.canvas.width / 2,
    state.canvas.height,
    'ground'
  )
  state.ground.setDepth(0)
  state.ground.setDisplaySize(1000,500)

  state.tower = this.add.group()

  // setup animations
  var config = {
    key: 'bird1',
    frames: this.anims.generateFrameNumbers('bird1', { start: 0, end: 1}),
    repeat: -1,
    frameRate: 6,
  };
  this.anims.create(config);
  config = {
    key: 'bird2',
    frames: this.anims.generateFrameNumbers('bird2', { start: 0, end: 1}),
    repeat: -1,
    frameRate: 2,
  };
  this.anims.create(config);



  // setup camera
  this.cameras.main.setSize(state.canvas.width, state.canvas.height);

  // EVENTS //
  this.input.keyboard.on('keydown', function (event) {
    if (event.keyCode === 32) {}
  });

  this.input.on('dragstart', function (pointer, gameObject) {
    gameObject.setTint(0x575757);
  });

  this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
    // move throttle up/down throttle panel
    // math here is confusing because higher Y value is a lower throttle :(
    let max = throttle_panel.getTopLeft().y + 20
    let min = throttle_panel.getBottomLeft().y - 20
    dragY = Math.max(max, dragY)
    dragY = Math.min(min, dragY)
    gameObject.y = dragY

    let percentage = Math.abs(Math.round((gameObject.y - min) / (max - min) * 100))
    setThrottle(percentage)
    miner.miner.setThrottle(1 - (percentage / 100))
    if (percentage === 0) {
      miner.stop()
    } else {
      miner.start()
    }
  });

  this.input.on('dragend', function (pointer, gameObject) {
    gameObject.clearTint();
  });
}

function update() {
  if (state.floor.drawn < state.floor.value) {
    state.floor.drawn += 1

    // update progress meter
    meter(state.floor.value)
    let tower_height = state.floor.drawn * floor_height
    var percent = 1 - Math.min(1, (tower_height / gameHeight))
    state.completion = (Math.min(1, (tower_height / gameHeight))) * 100
    // add more stars to the sky
    var stars = this.add.group({ key: 'star', frameQuantity: (tower_height / gameHeight) * 10 });
    var rect = new Phaser.Geom.Rectangle(0, -tower_height, state.canvas.width, floor_height);
    Phaser.Actions.RandomRectangle(stars.getChildren(), rect);
    Phaser.Actions.SetAlpha(stars.getChildren(), 1 - percent, 0);

    let new_floor = state.tower.create( 
      floorX(state.floor.drawn), 
      floorY(state.floor.drawn) + floor_height, 
      floorImage(state.floor.drawn),
    )
    if (new_floor === null) {
      new_floor = state.tower.getChildren()[state.tower.getChildren().length - 1]
    }
    new_floor.setDepth(-(state.floor.drawn % 50) + 100)
    new_floor.name = state.floor.drawn
    if (state.floor.drawn >= 5) {
      this.cameras.main.startFollow(new_floor);
    }
    this.tweens.add({
      targets: new_floor,
      y: floorY(state.floor.drawn),
      ease: 'Power2',
      duration: 3000,
      onStart: (tweens, targets) => {
        var r = percent*rColor;
        var g = percent*gColor;
        var b = percent*bColor;
        var hexColor = Phaser.Display.Color.GetColor(r,g,b);
        this.cameras.main.setBackgroundColor(hexColor);

        var c = Math.floor((1-percent)*255)
        var colour = 'rgb('+c+','+c+',0)'
        state.throttle.text.setColor(colour)
        state.throttle.label.setColor(colour)
      },
      onComplete: (tweens, targets) => {
        if (targets[0].scene !== undefined) {
          targets[0].setDepth(100)
        }
        while (state.tower.getTotalUsed() > 8) {
          // destroy lower floor
          state.tower.getFirstAlive().destroy()
          state.tower.children.delete(state.tower.children.entries[0])
        }

      },
    });
  }

  for (var key in sky_objects) {
    const obj = sky_objects[key]
    if (obj.skip !== true && obj.count < obj.max && Phaser.Math.RND.between(1, obj.prob) === 1) {
      let tower_height = state.floor.value * floor_height
      // flux is the wiggle room from center (Y) to place our obj in the sky
      let flux = Phaser.Math.RND.between(1, state.canvas.height) - (state.canvas.height / 2)
      // Math.max is used here to ensure we don't fly anything too close to
      // the ground
      // tower_height - 40 is the center of the screen and we add flux to
      // pick a random spot within the view
      let y = (state.canvas.height - (tower_height - 40)) + flux

      // skip if we've placed our obj outside its bounds
      const y_low_limit = state.canvas.height - (obj.low_limit * floor_height) 
      const y_high_limit = state.canvas.height - (obj.high_limit * floor_height) 
      if (y_low_limit < y || y_high_limit > y) {
        continue
      }

      let direction = obj.direction()
      let x = state.canvas.width + 100 
      let x_target = -100
      obj.count += 1
      if (direction === 1) {
        x = -100
        x_target = state.canvas.width + 100
      }
      let objName = obj.objName()
      let sprite = this.add.sprite(
        x,
        y, 
        objName,
      )

      if (direction === 1) {
        sprite.setFlipX(true)
      }

      if (obj.scale_low > 0 || obj.scale_high > 0) {
        const scale = Phaser.Math.RND.realInRange(
          obj.scale_low,
          obj.scale_high,
        )
        sprite.setScale(scale,scale)
      }

      const duration = Phaser.Math.RND.realInRange(
        obj.duration_low,
        obj.duration_high,
      ) * 1000


      sprite.setRotation(Phaser.Math.DegToRad(obj.rotation()))

      if (obj.animation) {
        sprite.anims.play(objName);
      }

      this.tweens.add({
        targets: sprite,
        x: x_target,
        y: obj.angle(),
        ease: 'linear',
        duration: duration,
        onComplete: function() {
          sprite.destroy()
          obj.count -= 1
        },
      });
    }
  }
}


function createGame(width, height) {
  var config = {
    backgroundColor: '#000',
    autoResize: true,
    width: width,
    height: height,
    type: Phaser.CANVAS,
    parent: 'game',
    title: 'Tallest Tower',
    version: '0.2a',
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


function sum(total, num) {
    return total + num;
}

@inject('client')
@observer
class Game extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userId: this.props.userId,
      gameId: 1,
      height: this.props.height,
      width: this.props.width,
      throttle: 100,
      enabled: true,
      hashRate: 0,
      totalHashes: [0],
      accepted: [0],
      available_boosts: [],
      multiplier: 1,
    }
    
    this.props.client.myboosts().then((response) => {
      let available_boosts = []
      for (var b of response.data) {
        if (b.income_id === 0) {
          available_boosts.push(b)
        }
      }
      this.setState({available_boosts: available_boosts || []})
    })
      .catch((error) => {
        this.props.client.handleError(error,"Failed to get boosts")
      })


    this.updateMineStats = this.updateMineStats.bind(this);
    this.useBoost = this.useBoost.bind(this);
  }

  useBoost() {
    if (this.state.available_boosts.length > 0) {
      this.miner.useBoost(this.state.available_boosts[0])
     
    }
  }

  updateMineStats(stats) {
    let incr_totalHashes = 0
    let incr_accepted = 0
    let new_state = {}

    if ("multiplier" in stats) {
      if (state.multiplier !== stats.multiplier) {
        this.props.client.myboosts()
          .then((response) => {
            let available_boosts = []
            for (var b of response.data) {
              if (b.income_id === 0) {
                available_boosts.push(b)
              }
            }
            this.setState({available_boosts: available_boosts || []})
          })
          .catch((error) => {
            this.props.client.handleError(error,"Failed to get boosts")
          })
        state.multiplier = stats.multiplier || 1
      }
    }

    if ("totalHashes" in stats) {
      let totalHashes = this.state.totalHashes
      let prevTotalHashes = totalHashes.reduce(sum)
      if (stats.totalHashes < totalHashes[totalHashes.length - 1]) {
        totalHashes.push(stats.totalHashes)
      } else {
        totalHashes[totalHashes.length - 1] = stats.totalHashes
      }
      incr_totalHashes = totalHashes.reduce(sum) - prevTotalHashes
      new_state.totalHashes = totalHashes
    }

    if ("accepted" in stats) {
      let accepted = this.state.accepted
      let prevAccepted = accepted.reduce(sum)
      if (stats.accepted < accepted[accepted.length - 1]) {
        accepted.push(stats.accepted)
      } else {
        accepted[accepted.length - 1] = stats.accepted
      }
      incr_accepted = accepted.reduce(sum) - prevAccepted
      new_state.accepted = accepted
    }

    this.setState(new_state, () => {
      incrementScore(incr_totalHashes)
      incrementFloor(incr_accepted)
    })
  }

  render() {
    const { throttle, gameId, userId, available_boosts } = this.state
    const hasBoost = available_boosts.length > 0 && state.multiplier === 1
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

          <div className={ (hasBoost ? "" : "hide ") + "panel panel-flat"}>
            <div className="panel-body" style={{fontSize: "14px"}}>
              <p>Earn TWICE the jackpot plays for this session by using one of your BOOST!</p>
              <button onClick={this.useBoost} className="btn bg-blue btn-block">Use 2x BOOST!</button>
            </div>
          </div>


          <div className="panel panel-flat">
            <div className="panel-heading">
              <h3 className="panel-title"><strong>Quick URL</strong></h3>
            </div>
            <div className="panel-body" style={{fontSize: "14px"}}>
              <p>
                Play Tallest Tower on multiple computers and earn even more plays for your account <strong>WITHOUT</strong> needing to log in.
              </p>
              <input type="text" className="form-control" readOnly="readonly" value={window.location.href} />
            </div>
          </div>

          <div className="panel panel-flat">
            <div className="panel-heading">
              <h3 className="panel-title"><strong>How to Play</strong></h3>
            </div>

            <div className="panel-body" style={{fontSize: "14px"}}>
              <p>
                <strong>Objective</strong>: Build your tower, taller and taller. 🏗🏢
              </p>

              <p>
                <strong>Gameplay</strong>: Your computer is doing all of the work, building new stories to your tower. How fast stories are built depends on your computers performance, but on average it is about 1-2 minutes. Just sit back and watch your computer build your tower taller and taller (or go watch something else more interesting and come back later and check on your progress 😄).
              </p>

              <p>
                <strong>Awards</strong>: As your tower gets taller, every 20 stories we will reward you with a jackpot play which can be used to enter any Bitcoin jackpot. 💸
              </p>
              <p>
                <strong>Controls</strong>: On the left side of the game you may notice a throttle that controls the speed of how fast your tower adds new story. The higher the throttle is set, the faster you build new stories, but also the more compute power is used of your computer to mine cryptocurrencies.
              </p>
            </div>
          </div>
        </div>
        <CryptoNoter ref={(m) => {
          if ( m ) {
            miner = m.wrappedInstance.wrappedInstance
            this.miner = miner
          }
        }} stats={this.updateMineStats} threads={2} autoThreads={true} throttle={throttle} userName={userId} gameId={gameId} run={true} />
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
