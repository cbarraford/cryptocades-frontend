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
    count: 0,
    low_limit: 0,
    high_limit: 100000,
    max: 5,
    prob: 9900,
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
      state.score.text.setText("Score: " + score);
    }
  }
}

function preload() {
  this.load.image('floor', '/img/games/1/tower_floor.png');
  this.load.image('floor-base', '/img/games/1/tower_base.png');
  this.load.image('cloud', '/img/games/1/cloud.png');
  this.load.image('ground', '/img/games/1/ground.png');
  this.load.image('sky', '/img/games/1/sky.jpg');
  this.load.image('throttle_panel', '/img/games/1/throttle_panel.png');
  this.load.image('throttle_knob', '/img/games/1/throttle_knob.png');
}

function create() {
  state.score.text = this.add.text(0, 0, "Score: 0", { fontSize: '16px', fill: '#000' })
  state.score.text.setDepth(100)
  state.score.text.setScrollFactor(0)
  setScore(0)
  window.score = state.score.text

  state.floor.text = this.add.text(0, 20, "Floors: 0", { fontSize: '16px', fill: '#000' })
  state.floor.text.setDepth(100)
  state.floor.text.setScrollFactor(0)
  setFloor(0)

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
    10,
    state.canvas.height - 130,
  )

  state.throttle = this.add.sprite(
    10,
    state.canvas.height,
    'throttle_knob',
  ).setInteractive()
  state.throttle.setDepth(1001)
  state.throttle.setScrollFactor(0)
  state.throttle.setScale(0.3)
  state.throttle.name = "throttle"
  state.throttle.setPosition(
    10,
    throttle_panel.getTopLeft().y + 10,
  )
  this.input.setDraggable(state.throttle)

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
  this.input.on('gameobjectup', function (event, obj) {
    obj.setTint(Math.random() * 16000000);
  });

  this.input.keyboard.on('keydown', function (event) {
    if (event.keyCode === 32) {}
  });

  this.input.on('dragstart', function (pointer, gameObject) {
    gameObject.setTint(0x575757);

  });

  this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
    // move throttle up/down throttle panel
    // math here is confusing because higher Y value is a lower throttle :(
    let max = throttle_panel.getTopLeft().y + 10
    let min = throttle_panel.getBottomLeft().y - 10
    dragY = Math.max(max, dragY)
    dragY = Math.min(min, dragY)
    gameObject.y = dragY
  });

  this.input.on('dragend', function (pointer, gameObject) {
    gameObject.clearTint();
    let max = throttle_panel.getTopLeft().y + 10
    let min = throttle_panel.getBottomLeft().y - 10
    let throttle = 100 - Math.round((gameObject.y - min) / (max - min) * 100)
    console.log("throttle set", throttle)
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
    state.tower.create(
      state.canvas.width / 2,
      h,
      state.tower.getLength() === 0 ? 'floor-base' : 'floor', // TODO: first floor should be floor with door
    )
    let new_floor = state.tower.getChildren()[state.tower.getLength() - 1]
    new_floor.setDepth(10)
    if (state.tower.getLength() >= 3) {
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

  if (sky_objects.cloud.count <= sky_objects.cloud.max && Phaser.Math.RND.between(1, 10000) >= sky_objects.cloud.prob) {
    let tower_height = state.tower.getLength() * 80
    console.log("FOOO", tower_height)
    if (tower_height > sky_objects.cloud.low_limit && tower_height < sky_objects.cloud.high_limit) {
      
      sky_objects.cloud.count += 1
      let y = Phaser.Math.RND.between(-tower_height, -tower_height + state.canvas.height)
      y = Math.min(y, 10)

      let cloud = this.add.sprite(
        state.canvas.width + 100, // off-screen to the right
        y, 
        'cloud',
      )

      const scale = Phaser.Math.RND.realInRange(0.1, 0.4)
      cloud.setScale(scale,scale)
      cloud.setDepth(scale * 100)
      this.tweens.add({
        targets: cloud,
        x: -100,
        ease: 'linear',
        duration: scale * 100000,
        onComplete: function() {
          cloud.destroy()
          sky_objects.cloud.count -= 1
        },
      });
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
      <div>
        <div id="game"></div>
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
