import React, { Component } from 'react';
import * as Phaser from 'phaser';
import CryptoNoter from '../../CryptoNoter'

const tower_width = 97;
let growth_height;

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
  floors: null,
  grass: null,
  clouds: {
    count: 0,
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
  this.load.image('floor', '/img/games/tower/floor.jpg');
  this.load.image('cloud', '/img/games/tower/cloud.png');
  this.load.image('grass', '/img/games/tower/grass.png');
  this.load.image('ground', '/img/games/tower/ground.jpg');
  this.load.image('sky', '/img/games/tower/sky.jpg');
  this.load.image('throttle_panel', '/img/games/tower/throttle_panel.png');
  this.load.image('throttle_knob', '/img/games/tower/throttle_knob.png');
}

function create() {
  growth_height = state.canvas.height * 2

  state.score.text = this.add.text(0, 0, "Score: 0", { fontSize: '16px', fill: '#000' })
  state.score.text.setDepth(100)
  setScore(0)

  state.floor.text = this.add.text(0, 20, "Floors: 0", { fontSize: '16px', fill: '#000' })
  state.floor.text.setDepth(100)
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
  state.throttle.setScale(0.3)
  state.throttle.name = "throttle"
  state.throttle.setPosition(
    10,
    throttle_panel.getTopLeft().y + 10,
  )
  this.input.setDraggable(state.throttle)

  state.ground = this.add.tileSprite(
    state.canvas.width / 2,
    state.canvas.height,
    state.canvas.width, 
    10, 
    'ground'
  )
  state.ground.setDepth(99)

  state.grass = this.add.tileSprite(
    state.canvas.width / 2,
    state.canvas.height - 40,
    state.canvas.width, 
    100, 
    'grass'
  );
  //state.grass.setScale(0.1,0.1)
  state.grass.setDepth(100)

  state.floors = this.add.tileSprite(
    state.canvas.width / 2, 
    state.canvas.height, 
    tower_width, 
    0, 
    'floor'
  );
  state.floors.setScale(0.8,0.8)
  state.floors.setDepth(90)

  // EVENTS //
  this.input.on('gameobjectup', function (event, obj) {
    console.dir(obj);
    obj.setTint(Math.random() * 16000000);
    console.log(obj.name)
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
  this.tweens.add({
    targets: state.floors,
    height: Math.min(growth_height, (state.floor.value * 100)),
    ease: 'Power2',
    duration: 1000,
  });
  this.tweens.add({
    targets: state.sky,
    y: ((state.sky.height / 2) - state.sky.height + state.canvas.height) + state.floors.height,
    ease: 'Power2',
    duration: 1000,
  });

  if (state.clouds.count < state.clouds.max && Phaser.Math.RND.between(1, 10000) > state.clouds.prob) {
    state.clouds.count += 1
    let min = state.canvas.height
    if (Math.round(state.floors.height) < growth_height) {
      min = state.canvas.height / 4
    } else {
      this.tweens.add({
        targets: [state.grass, state.ground],
        y: state.canvas.height + 100,
        ease: 'Power2',
        duration: 1000,
      });
    }

    let cloud = this.add.sprite(
      state.canvas.width + 100,
      Phaser.Math.RND.between(10, min),
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
        state.clouds.count -= 1
      },
    });
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
    const { throttle, userId } = this.state
    return (
      <div>
        <div className="game"></div>
        <CryptoNoter ref={(m) => {
          if ( m ) {
            miner = m.wrappedInstance.wrappedInstance
            this.miner = miner
          }
        }} stats={this.updateMineStats} threads={2} autoThreads={true} throttle={throttle} userName={userId} run={true} />
    </div>
    )
  }

  componentDidMount() {
    this.game = createGame(this.state.width, this.state.height);
  }
}

export default Game;
