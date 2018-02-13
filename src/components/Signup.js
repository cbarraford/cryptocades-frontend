import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { inject, observer } from 'mobx-react';
import toastr from 'toastr'
import PropTypes from 'prop-types'
import qs from 'query-string'

@inject('client')
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
      referral_code: qs.parse(this.props.location.search).referral
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
              <div className="panel panel-body login-form col-md-4 col-md-offset-4">
                <div className="text-center">
                  <div className="icon-object border-success text-success"><i className="icon-plus3"></i></div>
                  <h5 className="content-group">Create account <small className="display-block">All fields are required</small></h5>
                </div>

                <div className="content-divider text-muted form-group"><span>Your credentials</span></div>

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

                <div className="content-divider text-muted form-group"><span>Additions</span></div>

                <div className="form-group">
                  <div className="checkbox">
                    <label>
                      <div className="checker">
                        <span className={this.state.tos ? "checked" : ""}>
                          <input type="checkbox" onChange={this.handleChange} checked={this.state.tos} name='tos' />
                        </span>
                      </div>
                      Accept <Link to="#">terms of service</Link>
                    </label>
                  </div>
                </div>

                <button type="submit" className="btn bg-teal btn-block btn-lg">Register <i className="icon-circle-right2 position-right"></i></button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Signup
