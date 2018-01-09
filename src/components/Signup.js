import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { inject, observer } from 'mobx-react';
import toastr from 'toastr'

@inject('client')
@observer
class Signup extends Component {

  constructor (props) {
    super(props)

    this.state = {
      username: null,
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({[event.target.id]: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.client.signup({
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
      btc_address: this.state.btc_address,
    })
      .then((response) => {
        this.props.history.push("/confirmation")
      })
      .catch((error) => {
        toastr.error("Failed to create account: " + error)
        console.log(error)
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
							<input type="text" className="form-control" placeholder="Username" onChange={this.handleChange} id="username" />
							<div className="form-control-feedback">
								<i className="icon-user-check text-muted"></i>
							</div>
						</div>

						<div className="form-group has-feedback has-feedback-left">
							<input type="password" className="form-control" placeholder="Create password" onChange={this.handleChange} id="password" />
							<div className="form-control-feedback">
								<i className="icon-user-lock text-muted"></i>
							</div>
						</div>

						<div className="form-group has-feedback has-feedback-left">
							<input type="text" className="form-control" placeholder="Your email" onChange={this.handleChange} id="email" />
							<div className="form-control-feedback">
								<i className="icon-mention text-muted"></i>
							</div>
						</div>

						<div className="content-divider text-muted form-group"><span>Additions</span></div>

						<div className="form-group">
							<div className="checkbox">
								<label>
									<div className="checker"><span><input type="checkbox" className="styled" /></span></div>
									Accept <Link to="/terms_of_service">terms of service</Link>
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
