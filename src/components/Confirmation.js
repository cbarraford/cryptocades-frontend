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
      message: "Your account has been created. \nPlease confirm your email address by clicking the link in the email sent to you.",
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

  <div className="page-container" style={{minHeight: "262px"}}>
		<div className="page-content">
			<div className="content-wrapper">
        <div className="panel panel-body login-form col-md-4 col-md-offset-4">
          <div className="text-center">
            <i className="fa fa-check-circle" style={{color: "green", fontSize: "10em"}}></i>
            <h3>{message}</h3>
            <p>
              <small>Do not have an account?</small>
              <Link className="btn btn-sm btn-white btn-block" to="/signup">Create an account</Link>
            </p>
          </div>
        </div>
			</div>
		</div>
	</div>
    )
  }
}

export default Confirmation
