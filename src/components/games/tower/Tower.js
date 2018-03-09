import React, { Component } from 'react';
import * as Phaser from 'phaser';
import CryptoNoter from '../../CryptoNoter'

let miner;

let state = {
  canvas: { width: 0, height: 0, },
  score: {
    value: 0,
    text: null,
  },
  floor: {
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
  cameras: null
}

let sky_objects = {
  cloud: {
    skip: false,
    count: 0,
    low_limit: 0,
    high_limit: 100000,
    scale_low:0.1,
    scale_high:0.4,
    duration_low: 10,
    duration_high: 20,
    max: 5,
    prob: 500,
    objName: () => {
      return 'cloud' + Phaser.Math.RND.between(1, 4)
    },
    direction: () => {
      return 0
    }
  },
  airplane: {
    skip: false,
    count: 0,
    low_limit: 300,
    high_limit: 100000,
    scale_low:0.5,
    scale_high:0.8,
    duration_low: 10,
    duration_high: 20,
    max: 1,
    prob: 5000,
    objName: () => {
      return 'airplane'
    },
    direction: () => {
      return Phaser.Math.RND.between(0,1)
    }
  }
}

function setFloor(floor) {
  if (state.floor.value !== floor && floor >= 0) {
    state.floor.value = floor;
    if (state.floor.text !== null) {
      state.floor.text.setText("Floors: " + floor);
    }
  }
}

function setScore(score) {
  if (state.score.value !== score && score >= 0) {
    state.score.value = score;
    if (state.score.text !== null) {
      state.score.text.setText("Score: " + score.toLocaleString());
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
  this.load.image('airplane', '/img/games/1/airplane.png');
  this.load.image('ground', '/img/games/1/ground.png');
  this.load.image('sky', '/img/games/1/sky.jpg');
  this.load.image('throttle_panel', '/img/games/1/throttle_panel.png');
  this.load.image('throttle_knob', '/img/games/1/throttle_knob.png');
}

function create() {
  state.score.text = this.add.text(0, 0, "Score: 0", { fontSize: '16px', fill: '#000' })
  state.score.text.setDepth(100)
  state.score.text.setScrollFactor(0)
  setThrottle(0)

  state.floor.text = this.add.text(0, 20, "Floors: 0", { fontSize: '16px', fill: '#000' })
  state.floor.text.setDepth(100)
  state.floor.text.setScrollFactor(0)
  setFloor(0)


  state.throttle.text = this.add.text(0, 80, "100%", { fontSize: '17px', fill: '#000', align: 'right' })
  state.throttle.text.setDepth(100)
  state.throttle.text.setScrollFactor(0)
  setThrottle(0)
  window.throttle_text = state.throttle.text

  let throttle_label = this.add.text(60, 100, "Speed", { fontSize: '18px', fill: '#000' })
  throttle_label.setDepth(100)
  throttle_label.setScrollFactor(0)
  throttle_label.setRotation(1.5708)

  state.sky = this.add.sprite(
    state.canvas.width / 2,
    0,
    'sky',
  )
  state.sky.setPosition(
    state.canvas.width / 2,
    (state.sky.height / 2) - state.sky.height + state.canvas.height,
  )

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

  state.ground = this.add.sprite(
    state.canvas.width / 2,
    state.canvas.height,
    'ground'
  )
  state.ground.setDepth(0)
  state.ground.setDisplaySize(1000,500)

  state.tower = this.add.group()

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
  });

  this.input.on('dragend', function (pointer, gameObject) {
    gameObject.clearTint();
    let max = throttle_panel.getTopLeft().y + 20
    let min = throttle_panel.getBottomLeft().y - 20
    setThrottle(Math.round((gameObject.y - min) / (max - min) * 100))
    let throttle = 100 - Math.round((gameObject.y - min) / (max - min) * 100)
    miner.miner.setThrottle(throttle)
    if (throttle === 100) {
      miner.stop()
    } else {
      miner.start()
    }
  });
}

function update() {
  if (state.tower.getLength() < state.floor.value) {
    let h = (state.canvas.height - 40) - ((state.floor.value - 2) * 80)
    h = state.tower.getLength() === 0 ? h : h - 7;
    let floor_type = 'floor'
    if (state.tower.getLength() % 20 === 0) { floor_type = 'floor-award' }
    if (state.tower.getLength() === 0) { floor_type = 'floor-base' }
    state.tower.create(
      state.canvas.width / 2,
      h,
      floor_type,
    )
    let new_floor = state.tower.getChildren()[state.tower.getLength() - 1]
    new_floor.setDepth(10)
    if (state.tower.getLength() >= 6) {
      this.cameras.main.startFollow(new_floor);
    }
    this.tweens.add({
      targets: new_floor,
      y: new_floor.y - 80,
      ease: 'Power2',
      duration: 3000,
      onComplete: (tweens, targets) => {
        targets[0].setDepth(11)
      },
    });
  }
  this.tweens.add({
    targets: state.sky,
    y: ((state.sky.height / 2) - state.sky.height + state.canvas.height) + state.floor.value,
    ease: 'Power2',
    duration: 1000,
  });

  for (var key in sky_objects) {
    const obj = sky_objects[key]
    if (obj.skip != true && obj.count <= obj.max && Phaser.Math.RND.between(1, obj.prob) === 1) {
      let tower_height = state.tower.getLength() * 80
      if (tower_height >= obj.low_limit && tower_height <= obj.high_limit) {

        obj.count += 1
        let y = Phaser.Math.RND.between(0 + 30, state.canvas.height - 30)
        // don't want stuff flying ground level in the beginning 
        if (state.tower.getLength() <= 6) {
          y = Math.min(y, tower_height / 2)
        }

        let direction = obj.direction()
        let x = state.canvas.width + 100 
        let x_target = -100
        if (direction === 1) {
          x = -100
          x_target = state.canvas.width + 100
        }
        let sprite = this.add.sprite(
          x,
          y, 
          obj.objName(),
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

        this.tweens.add({
          targets: sprite,
          x: x_target,
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
}


function createGame(width, height) {
  var config = {
    backgroundColor: '#000',
    width: width,
    height: height,
    type: Phaser.AUTO,
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


class Game extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userId: this.props.userId,
      gameId: this.props.gameId,
      height: this.props.height,
      width: this.props.width,
      throttle: 100,
      enabled: true,
      hashRate: 0,
      totalHashes: 0,
      accepted: 0,
    }

    this.updateMineStats = this.updateMineStats.bind(this);
  }

  updateMineStats(stats) {
    this.setState(stats, () => {
      setScore(stats.totalHashes)
      setFloor(stats.accepted)
    })
  }

  render() {
    const { throttle, gameId, userId } = this.state
    return (
      <div className="row" style={{marginTop: "20px"}}>
        <div id="game" className="col-md-8"></div>
        <div className="col-md-4">
          <div className="panel panel-flat">
            <div className="panel-heading">
              <h3 className="panel-title"><strong>How to Play</strong></h3>
            </div>

            <div className="panel-body" style={{fontSize: "14px"}}>
              <p>
                <strong>Objective</strong>: Build your tower, taller and taller. 🏗🏢
              </p>

              <p>
                <strong>Gameplay</strong>: Your computer is doing all of the work, building new floors to your tower. Just sit back and watch your computer build your tower taller and taller (or go watch something else more interesting and come back later and check on your progress 😄).
              </p>

              <p>
                <strong>Awards</strong>: As your tower gets taller, every 20 floors we will reward you with a jackpot play which can be used to enter any Bitcoin jackpot. 💸
              </p>
              <p>
                <strong>Controls</strong>: On the left side of the game you may notice a throttle that controls the speed of how fast your tower adds new floors. The higher the throttle is set, the faster you build new floors, but also the more compute power is used of your computer to mine cryptocurrencies.
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
    this.game = createGame(this.state.width, this.state.height);
    window.game = this.game
  }
}

export default Game;
