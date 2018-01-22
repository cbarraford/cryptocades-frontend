import React, { Component } from 'react';
import * as Phaser from 'phaser';

class Game extends Component {

  render() {
    return (<div className="towerbox"></div>)
  }

  componentDidMount() {
    this.createGame(this.props.width, this.props.height);
  }

  preload() {
  }

  create(game) {
    game.stage.backgroundColor = '#71c5cf';

    // Set the physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    this.rect = new Phaser.Geom.Rectangle(32, 32, 128, 256);

    game.physics.arcade.enable(this.rect);
  }

  createGame(width, height) {
    var config = {
      width: 800,
      height: 600,
      resolution: 1,
      type: Phaser.WEBGL,
      parent: 'towerbox',
      state: {
        preload: this.preload,
        create: this.create
      },
      callbacks: {
        preBoot: function () { console.log('I get called before all of the Game systems are created, but after Device is available')},
        postBoot: function () { console.log('I get called after all of the Game systems are running, immediately before raf starts')}
      }
    };

    var game = new Phaser.Game(config);

    console.log("Game:", game)
    game.start();
  }

}

export default Game;
