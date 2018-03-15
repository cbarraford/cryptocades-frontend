import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import toastr from 'toastr'
import PropTypes from 'prop-types'
import qs from 'query-string'
import cookie from 'react-cookies'
import FacebookLogin from 'react-facebook-login'
import ReCAPTCHA from "react-google-recaptcha";

@inject('client')
@inject('store')
@observer
class Signup extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
  }

  constructor (props) {
    super(props)

    this.state = {
      username: null,
      tos: false,
      referral_code: qs.parse(this.props.location.search).referral,
      captcha_code: null,
    }

    this.fbResponse = this.fbResponse.bind(this);
    this.postLogin = this.postLogin.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.captcha = this.captcha.bind(this);
  }

  captcha(val) {
    this.setState({captcha_code: val})
  }

  // TODO: not dry, use login func
  fbResponse(req) {
    if (!this.state.tos) {
      toastr.error("Must agree to the terms of service.")
      return false
    }
    req.referral_code = this.state.referral_code
    req.captcha_code = this.state.captcha_code
    this.postLogin(this.props.client.facebookLogin(req))
  }

  // TODO: not dry, use login func
  postLogin(req) {
    req
      .then((response) => {
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
        console.error(error)
        this.props.client.handleError(error, "Failed to login")
      })
  }


  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? !this.state.tos : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.captcha_code === null) {
      toastr.error("Please check the Google ReCAPTCHA checkbox.")
      return
    }
    if (!this.state.tos) {
      toastr.error("Must agree to the terms of service.")
      return
    }
    this.props.client.signup({
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
      btc_address: this.state.btc_address,
      referral_code: this.state.referral_code,
      captcha_code: this.state.captcha_code,
    })
      .then((response) => {
        this.props.history.push("/confirmation")
      })
      .catch((error) => {
        this.props.client.handleError(error, "Failed to create account")
      })
  }

  render() {
    return (
      <div className="page-container" style={{minHeight: "262px"}}>
        <div className="page-content">
          <div className="content-wrapper">
            <form onSubmit={this.handleSubmit} >
              <div style={{paddingBottom: "40px"}} className="panel panel-body login-form col-md-4 col-md-offset-4 key-pattern">
                <div className="text-center">
                  <div className="">
                    <img style={{height: "60px"}} id="signup-icon" alt="sign up" src="/img/diamond_plus.png"/>
                  </div>
                  <h5 style={{color: "white"}} className="content-group">Create account</h5>
                </div>
                <div className="col-md-10 col-md-offset-1">
                  <div className="text-center">
                    <p>Social Sign Up</p>
                    <div className="facebook-button" style={{marginBottom: "20px"}}>
                      <FacebookLogin
                        appId="785415074997932"
                        autoLoad={false}
                        isMobile={true}
                        disableMobileRedirect={true}
                        size="small"
                        scope="public_profile,email,user_birthday"
                        icon="fa-facebook"
                        fields="name,email,picture"
                        textButton="log in with facebook"
                        callback={this.fbResponse} />
                    </div>
                    <p>OR</p>
                    <p>All fields required</p>
                  </div>
                </div>
                <div className="col-md-10 col-md-offset-1">
                  <div className="form-group has-feedback has-feedback-left">
                    <input type="text" className="form-control" placeholder="Username" onChange={this.handleChange} name="username" />
                    <div className="form-control-feedback">
                      <i className="icon-user-check text-muted"></i>
                    </div>
                  </div>

                  <div className="form-group has-feedback has-feedback-left">
                    <input type="password" className="form-control" placeholder="Create password" onChange={this.handleChange} name="password" />
                    <div className="form-control-feedback">
                      <i className="icon-user-lock text-muted"></i>
                    </div>
                  </div>

                  <div className="form-group has-feedback has-feedback-left">
                    <input type="text" className="form-control" placeholder="Your email" onChange={this.handleChange} name="email" />
                    <div className="form-control-feedback">
                      <i className="icon-mention text-muted"></i>
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="checkbox">
                      <label>
                        <div className="checker">
                          <span className={this.state.tos ? "checked" : ""} style={{color: "inherit", borderColor:"inherit"}}>
                            <input type="checkbox" onChange={this.handleChange} checked={this.state.tos} name='tos' />
                          </span>
                        </div>
                        Accept <a href="https://cryptocades.com/terms/">terms of service</a>
                      </label>
                    </div>
                  </div>

                <div className="center">
                  <ReCAPTCHA
                    ref={(el) => { this.captcha = el; }}
                    sitekey="6LfvhEoUAAAAANvwOQ65XNm72kPq3I64z4DqApE6"
                    onChange={this.captcha}
                  />
                </div>
                <br />
                  <button type="submit" style={{color: "#266586", backgroundColor: "#fdfbf0"}} className="btn btn-block btn-lg">Register</button>
                </div>

              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Signup
