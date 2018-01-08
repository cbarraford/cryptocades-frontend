import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import toastr from 'toastr'
import PropTypes from 'prop-types'

@inject('client')
@observer
class ForgetPassword extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)

    this.state = {
      email: null,
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({[event.target.id]: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.client.password_reset(
      this.state.email,
    )
      .then((response) => {
        toastr.success("Success! Check your email for a reset password link.")
      })
      .catch((error) => {
        toastr.error("Failed to reset password:", error)
        console.log(error)
      })
  }

  render() {
    return (
  <div className="page-container" style={{minHeight:"481px"}}>
    <div className="page-content">
      <div className="content-wrapper">
        <form onSubmit={this.handleSubmit}>
          <div className="panel panel-body login-form col-md-4 col-md-offset-4">
            <div className="text-center">
              <div className="icon-object border-warning text-warning">
                <i className="icon-spinner11"></i>
              </div>
              <h5 className="content-group">Password recovery <small className="display-block">We'll send you instructions in email</small></h5>
            </div>

            <div className="form-group has-feedback">
              <input type="email" className="form-control" placeholder="Your email" onChange={this.handleChange} id="email" />
              <div className="form-control-feedback">
                <i className="icon-mail5 text-muted"></i>
              </div>
            </div>

            <button type="submit" className="btn bg-blue btn-block">Reset password <i className="icon-arrow-right14 position-right"></i></button>
          </div>
        </form>
      </div>
    </div>
  </div>
    )
  }
}

export default ForgetPassword
