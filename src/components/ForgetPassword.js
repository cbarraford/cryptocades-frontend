import React, { Component } from 'react';
import { Link } from 'react-router-dom'
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
    console.log(this.state.email);
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
      <div className="middle-box col-md-4 col-md-offset-4 text-center loginscreen animated fadeInDown">
        <div>
            <div>
                <h1 className="logo-name">Bitto</h1>
            </div>
            <h3>Forget your password?</h3>
            <p>Reset your password</p>
            <form className="m-t" onSubmit={this.handleSubmit} >
                <div className="form-group">
                    <input type="text" className="form-control" placeholder="Email Address" required="" onChange={this.handleChange} id="email" />
                </div>
                <button type="submit" className="btn btn-primary block full-width m-b">Reset Password</button>

                <p className="text-muted text-center">
                <small>Do not have an account?</small>
                <Link className="btn btn-sm btn-white btn-block" to="/signup">Create an account</Link>
                </p>
            </form>
        </div>
    </div>
    )
  }
}

export default ForgetPassword
