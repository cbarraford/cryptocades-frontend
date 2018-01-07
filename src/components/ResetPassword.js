import React, { Component } from 'react';
import { Link } from 'react-router-dom'
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
        toastr.error("Failed to reset password:", error)
        console.log(error)
      })
  }

  render() {
    return (
      <div className="middle-box col-md-4 col-md-offset-4 text-center loginscreen animated fadeInDown">
        <div>
            <div>
                <h1 className="logo-name">Bitto</h1>
            </div>
            <h3>Enter a new password</h3>
            <form className="m-t" onSubmit={this.handleSubmit} >
                <div className="form-group">
                    <input type="password" className="form-control" placeholder="Password" required="" onChange={this.handleChange} id="password" />
                </div>
                <button type="submit" className="btn btn-primary block full-width m-b">Reset Password</button>

                <p>
                <Link to="/password/reset"><small>Forgot password?</small></Link>
                </p>
            </form>
        </div>
    </div>
    )
  }
}

export default ResetPassword
