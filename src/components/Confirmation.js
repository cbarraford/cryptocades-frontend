import React, { Component } from 'react';
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
      title: "Your account has been created",
      content: "Please confirm your email address by clicking the link in the email sent to you.",
    }

    if (props.match.params.code) {
      this.setState({"message": "Please wait...", "content": "Confirming new user."})
      this.props.client.confirmation(
        props.match.params.code,
      )
        .then((response) => {
          toastr.success("Success! The new user has been confirmed. Login to continue.")
          this.props.history.push('/login')
        })
        .catch((error) => {
          this.props.client.handleError(error,"Failed to confirm new user")
        })
    }
  }

  render() {
    const { title, content } = this.state;
    return (

  <div className="page-container" style={{minHeight: "262px"}}>
		<div className="page-content">
			<div className="content-wrapper">
        <div className="panel panel-body login-form col-md-4 col-md-offset-4">
          <div className="text-center">
            <div className="icon-object border-success text-success">
              <i className="icon-checkmark4"></i>
            </div>
            <h5 className="content-group">{title}<small className="display-block">{content}</small></h5>
          </div>
        </div>
			</div>
		</div>
	</div>
    )
  }
}

export default Confirmation
