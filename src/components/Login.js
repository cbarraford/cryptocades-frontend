import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { inject, observer } from 'mobx-react';
import cookie from 'react-cookies'
import PropTypes from 'prop-types'
import queryString from 'query-string'

@inject('store')
@inject('client')
@observer
class Login extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

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
    this.props.client.login(
      this.state.username,
      this.state.password,
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

        this.props.client.me()
          .then((response) => {
            this.props.store.me = response.data
          })
          .catch((error) => {
            console.log(error)
            this.props.store.me = {}
          })

        const parsed = queryString.parse(this.props.location.search)
        if (parsed.redirect) {
          this.props.history.push(parsed.redirect)
        } else {
          this.props.history.push('/games')
        }
       })
      .catch((error) => {
        this.props.client.handleError(error, "Failed to login")
      })
  }

  render() {
    return (
  <div className="page-container" style={{minHeight:"381px"}}>
		<div className="page-content">
			<div className="content-wrapper">
				<form onSubmit={this.handleSubmit} >
					<div className="panel panel-body login-form col-md-4 col-md-offset-4">
						<div className="text-center">
							<div className="icon-object border-slate-300 text-slate-300"><i className="icon-user"></i></div>
							<h5 className="content-group">Login to your account <small className="display-block">Enter your credentials below</small></h5>
						</div>

						<div className="form-group has-feedback has-feedback-left">
							<input type="text" className="form-control" placeholder="Username" onChange={this.handleChange} id="username" />
							<div className="form-control-feedback">
								<i className="icon-user text-muted"></i>
							</div>
						</div>

						<div className="form-group has-feedback has-feedback-left">
							<input type="password" className="form-control" placeholder="Password" onChange={this.handleChange} id="password" />
							<div className="form-control-feedback">
								<i className="icon-lock2 text-muted"></i>
							</div>
						</div>

						<div className="form-group">
							<button type="submit" className="btn btn-primary btn-block">Sign in <i className="icon-circle-right2 position-right"></i></button>
						</div>

						<div className="text-center">
							<Link to="/password/forget">Forgot password?</Link>
              <p className="text-muted text-center"><small>Do not have an account?</small><Link className="btn btn-sm btn-white btn-block" to="/signup">Create an account</Link>
              </p>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
    )
  }
}

export default Login
