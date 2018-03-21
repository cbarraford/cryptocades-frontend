import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { inject, observer } from 'mobx-react';
import cookie from 'react-cookies'
import PropTypes from 'prop-types'
import qs from 'query-string'
import FacebookLogin from 'react-facebook-login'

@inject('store')
@inject('client')
@observer
class Login extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  constructor (props) {
    super(props)

    this.state = {
      username: null,
      referrer: qs.parse(this.props.location.search).referral
    }

    if (this.props.store.logged_in) {
      this.props.history.push('/games')
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fbResponse = this.fbResponse.bind(this);
    this.postLogin = this.postLogin.bind(this);
  }

  fbResponse(req) {
    req.referrer = this.state.referrer
    this.postLogin(this.props.client.facebookLogin(req))
  }

  handleChange(event) {
    this.setState({[event.target.id]: event.target.value});
  }

  postLogin(req) {
    req.then((response) => {
      this.props.client.token = response.data.token;
      cookie.save('token', response.data.token, { path: '/' });
      cookie.save('token_expire', response.data.expire_time, { path: '/' });
      cookie.save('token_escalated', response.data.escalated_time, { path: '/' });
      this.props.client.setToken(response.data.token);
      this.props.store.token = response.data.token;
      this.props.store.tokenExpire = Date.parse(response.data.expire_time);
      this.props.store.tokenEscalated = Date.parse(response.data.escalated_time);

      this.props.client.me()
        .then((response) => {
          this.props.store.me = response.data
        })
        .catch((error) => {
          console.error(error)
          this.props.store.me = {}
        })

      const parsed = qs.parse(this.props.location.search)
      if (parsed.redirect) {
        this.props.history.push(parsed.redirect)
      } else {
        this.props.history.push('/games')
      }
    })
      .catch((error) => {
        this.props.client.handleError(error, "Failed to login")
      })
  }

  handleSubmit(event) {
    event.preventDefault();
    this.postLogin(this.props.client.login(
      this.state.username,
      this.state.password,
    ))
  }

  render() {
    return (
      <div className="page-container" style={{minHeight:"381px"}}>
        <div className="page-content">
          <div className="content-wrapper">
            <form onSubmit={this.handleSubmit} >
              <div style={{paddingBottom: "40px"}} className="panel panel-body login-form col-md-4 col-md-offset-4 key-pattern">
                <div className="text-center">
                  <img style={{height: "60px"}} alt="sign up" src="/img/diamond_lock.png"/>
                  <h5 style={{color: "white"}} className="content-group">Log In</h5>

                  <p>Social Log In</p>
                  <div className="row">
                    <div className="facebook-button col-md-10 col-md-offset-1">
                      <FacebookLogin
                        appId="785415074997932"
                        autoLoad={false}
                        size="small"
                        scope="public_profile,email,user_birthday"
                        icon="fa-facebook"
                        fields="name,email,picture"
                        callback={this.fbResponse} />
                    </div>
                  </div>
                  <h5 className="content-group">OR</h5>

                </div>
                <div className="col-md-10 col-md-offset-1">
                  <div className="form-group has-feedback has-feedback-left">
                    <input type="text" className="form-control" placeholder="Username" onChange={this.handleChange} id="username" />
                    <div className="form-control-feedback">
                      <i className="icon-user text-muted"></i>
                    </div>
                  </div>

                  <div className="form-group has-feedback has-feedback-left">
                    <input type="password" className="form-control" placeholder="Password" onChange={this.handleChange} id="password" />
                    <div className="form-control-feedback">
                      <i className="icon-lock2 text-muted"></i>
                    </div>
                  </div>

                  <div className="form-group text-center">
                    <button type="submit" className="btn btn-block">Log in</button>
                    <hr />
                    <Link to="/password/forget">Forgot password?</Link>
                    <p className="text-center">
                      <small style={{color: "white"}} >Do not have an account?</small><Link to="/signup"> Create an account</Link>
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
)
  }
}

export default Login
