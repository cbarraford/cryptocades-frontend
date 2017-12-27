import React from 'react';
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import cookie from 'react-cookies'
import { inject, observer } from 'mobx-react';

@inject('store')
@inject('client')
@observer
export default class AuthCallback extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  }
  constructor (props) {
    super(props)

    this.state = {
      status: "Please wait...",
      message: "You are currently being logged out, please wait a tick.",
    }
  }

  componentDidMount() {
    const token = this.props.client.client.defaults.headers.Session
    const { history } = this.props
    if (!token) {
      this.setState({
        status: "Goodbye 👋🏻",
        message: "Ya'll come back now! Ya hear?"
      })
      history.push('/')
    } else {
      this.props.client.logout()
        .then((response) => {
          console.log("Token revoked")
          cookie.remove('token', { path: '/' })
          this.props.store.me = {};
          this.props.store.token = null;
          this.setState({
            status: "Goodbye 👋🏻",
            message: "Ya'll come back now! Ya hear?",
          })
          history.push('/')
        })
        .catch((error) => {
          console.log(error);
          this.props.store.me = {};
          this.props.store.token = null;
          cookie.remove('token', { path: '/' })
          history.push('/')
        });
    }
  }

  render() {
    const { status, message } = this.state
    return (
      <div className="jumbotron">
        <h1>{status}</h1>
        <p>{message}</p>
        <p><Link to="/" role="button" className="btn btn-primary btn-lg">Return home</Link></p>
      </div>
    )
  }
}
