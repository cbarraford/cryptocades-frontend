import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import toastr from 'toastr'
import PropTypes from 'prop-types'

@inject('client')
@observer
class ResetPassword extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
  }

  constructor (props) {
    super(props)

    this.state = {
      code: props.match.params.code,
      password: null,
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({[event.target.id]: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.client.password_new(
      this.state.code,
      this.state.password,
    )
      .then((response) => {
        toastr.success("Success! Your password has been updated.")
        this.props.history.push('/login')
      })
      .catch((error) => {
        toastr.error(error.response.data.message, "Failed to reset password")
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
                <i className="icon-key"></i>
              </div>
              <h5 className="content-group">Password reset <small className="display-block">Please enter your new password.</small></h5>
            </div>

            <div className="form-group has-feedback">
              <input type="password" className="form-control" placeholder="Your new password" onChange={this.handleChange} id="password" />
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

export default ResetPassword
