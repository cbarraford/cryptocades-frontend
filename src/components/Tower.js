import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types'
import Game from './games/tower/Tower'

@inject('store')
@observer
class Tower extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      userId: this.props.match.params.user_id,
      gameId: this.props.match.params.game_id,
    }
  }

  render() {
    const { id } = this.props.store.me
    const { gameId, userId } = this.state;
    return (
      <div className="wrapper wrapper-content">
        <div className="container">
          <Game height={600} width={800} userId={userId || id.toString()} gameId={gameId} />
        </div>
      </div>
    );
  }
}

export default Tower;
