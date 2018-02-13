import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Modal } from 'react-bootstrap/lib';
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import toastr from 'toastr'
import cookie from 'react-cookies'

@inject('store')
@inject('client')
@observer
class Profile extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)

    this.state = {
      openModal: false,
      lastAccountChange: null,
      auth_password: null,
      btc_address: null,
      password: null,
      email: null,
    }

    this.props.client.me()
      .then((response) => {
        this.refs.email.value = response.data.email
        this.refs.btc_address.value = response.data.btc_address.trim()
        this.setState({ 
          btc_address: response.data.btc_address.trim(), 
          email: response.data.email,
        })
      })
      .catch((error) => {
        console.log(error)
      })

    this.toggleModal = this.toggleModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.updateEmail = this.updateEmail.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.reAuthenticate = this.reAuthenticate.bind(this);
  }

  handleChange(event) {
    this.setState({[event.target.id]: event.target.value});
  }

  updateProfile(event) {
    event.preventDefault();
    const { hasEscalation } = this.props.store
    if (!hasEscalation) {
      this.toggleModal()
      this.setState({ lastAccountChange: "profile" })
      return
    }
    const { btc_address, password } = this.state
    const { history } = this.props
    this.props.client.updateMe({
      btc_address: btc_address,
      password: password,
    })
      .then((response) => {
        toastr.success("Updated profile.")
        this.setState({ lastAccountChange: null })
      })
      .catch((error) => {
        this.props.client.handleError(error, "Failed to update profile")
        if (error.response.status === 401) {
          history.push("/login?redirect=/profile")
        }
      })
  }

  updateEmail(event) {
    event.preventDefault();
    const { hasEscalation } = this.props.store
    if (!hasEscalation) {
      this.toggleModal()
      this.setState({ lastAccountChange: "email" })
      return
    }
    const { email } = this.state
    const { history } = this.props
    this.props.client.updateEmail({
      email: email,
    })
      .then((response) => {
        toastr.success("Updated email. Your new email address must be confirmed from your old email address. Please log into your old email account and verify the new address by clicking the confirmation link provided.")
        this.setState({ lastAccountChange: null })
      })
      .catch((error) => {
        this.props.client.handleError(error, "Failed to update email")
        if (error.response.status === 401) {
          history.push("/login?redirect=/profile")
        }
      })
  }

  toggleModal() {
    this.setState({ openModal: !this.state.openModal })
  }

  reAuthenticate(event) {
    event.preventDefault();
    this.props.client.login(
      this.props.store.me.username,
      this.state.auth_password,
    )
      .then((response) => {
        this.props.client.token = response.data.token;
        cookie.save('token', response.data.token, { path: '/' });
        cookie.save('token_expire', response.data.expire_time, { path: '/' });
        cookie.save('token_escalated', response.data.escalated_time, { path: '/' });
        this.props.client.setToken(response.data.token);
        this.props.store.token = response.data.token;
        this.props.store.tokenExpire = Date.parse(response.data.expire_time);
        this.props.store.tokenEscalated = Date.parse(response.data.escalated_time);

        if (this.state.lastAccountChange === "email") {
          this.updateEmail(event)
        } else if (this.state.lastAccountChange === "profile") {
          this.updateProfile(event)
        }
        this.toggleModal()
      })
      .catch((error) => {
        this.props.client.handleError(error, "Failed to reauthenticate")
      })
  }

  render() {
    const { openModal } = this.state
    return (
      <div className="page-container" style={{minHeight: "262px"}}>
        <div className="page-content">
          <div className="content-wrapper">
            <div className="panel panel-flat">
              <div className="panel-heading">
                <h6 className="panel-title">Profile information<a className="heading-elements-toggle"><i className="icon-more"></i></a></h6>
              </div>

              <div className="panel-body">
                <form onSubmit={this.updateProfile} >
                  <div className="form-group">
                    <div className="row">
                      <div className="col-md-6">
                        <label>Bitcoin Address</label>
                        <input type="text" className="form-control" ref="btc_address" onChange={this.handleChange} placeholder="1MiJFQvupX5kSZcUtfSoD9NtLevUgjv3uq" id="btc_address" />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="row">
                      <div className="col-md-6">
                        <label>Password</label>
                        <input type="password" className="form-control" ref="password" onChange={this.handleChange} id="password" />
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <button type="submit" className="btn btn-primary"><i className="icon-floppy-disk"></i> Save</button>
                  </div>
                </form>
              </div>
            </div>

            <div className="panel panel-flat">
              <div className="panel-heading">
                <h6 className="panel-title">Change Email<a className="heading-elements-toggle"><i className="icon-more"></i></a></h6>
              </div>

              <div className="panel-body">
                <form onSubmit={this.updateEmail} >
                  <div className="form-group">
                    <div className="row">
                      <div className="col-md-6">
                        <label>Email</label>
                        <input type="email" className="form-control" ref="email" onChange={this.handleChange} id="email" />
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <button type="submit" className="btn btn-primary"><i className="icon-floppy-disk"></i> Save</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <Modal show={openModal} onHide={this.toggleModal} >
          <Modal.Header className="bg-warning" closeButton>
            <Modal.Title id='ModalHeader'>Save account changes</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Re-enter your Cryptocades password to save changes to your account.</p>
            <form onSubmit={this.reAuthenticate}>
              <div className="form-group">
                <input id="auth_password" className="form-control" type="password" placeholder="Password" onChange={this.handleChange} />
                <p>
                  <small>
                    <Link to="/password/forget" >Forgot your password?</Link>
                  </small>
                </p>
              </div>
              <button type="submit" className="btn bg-blue btn-block">Save changes</button>
            </form>
          </Modal.Body>
        </Modal>
      </div>
    )
  }
}

export default Profile
