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
      gameId: 1,
    }
  }

  render() {
    const { id } = this.props.store.me
    const { gameId, userId } = this.state;
    const width = Math.min(document.body.clientWidth, 800)
    const height = Math.min(document.body.clientHeight, 600)
    return (
      <div className="page-container" style={{minHeight: "68px"}}>
        <div className="page-content">
          <div className="wrapper wrapper-content">
            <Game height={height} width={width} userId={userId || id.toString()} gameId={gameId} />
          </div>
        </div>
      </div>
    );
  }
}

export default Tower;
