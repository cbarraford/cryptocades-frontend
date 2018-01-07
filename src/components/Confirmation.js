import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { inject, observer } from 'mobx-react';
import toastr from 'toastr'
import PropTypes from 'prop-types'

@inject('client')
@observer
class Confirmation extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
  }

  constructor (props) {
    super(props)

    this.state = {
      message: "Your account has been created. Please confirm your email address by clicking the link in the email sent to you.",
    }

    if (props.match.params.code) {
      this.setState({"message": "Confirming new user... please wait."})
      this.props.client.confirmation(
        props.match.params.code,
      )
        .then((response) => {
          toastr.success("Success! The new user has been confirmed. Login to continue.")
          this.props.history.push('/login')
        })
        .catch((error) => {
          toastr.error("Failed to confirm new user:", error)
          console.log(error)
        })
    }
  }

  render() {
    const { message } = this.state;
    return (
      <div className="middle-box col-md-4 col-md-offset-4 text-center loginscreen animated fadeInDown">
        <div>
          <div>
            <h1 className="logo-name">Bitto</h1>
          </div>
          <h3>{message}</h3>
          <p>
            <small>Do not have an account?</small>
            <Link className="btn btn-sm btn-white btn-block" to="/signup">Create an account</Link>
          </p>
        </div>
      </div>
    )
  }
}

export default Confirmation
