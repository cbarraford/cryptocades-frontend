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
      userId: this.props.store.me.id || props.match.params.user_id,
    }
  }

  render() {
    const { userId } = this.state;
    return (
      <div className="wrapper wrapper-content">
        <div className="container">
          <div className="row">
            <div className="col-md-offset-2 col-md-8" style={{padding: "10px 200px"}}>
              <Game height={300} width={800} userId={userId} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Tower;
