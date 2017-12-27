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
    console.log(this.state);
    this.props.client.login(
      this.state.username,
      this.state.password,
    )
      .then((response) => {
        console.log(response);
        this.props.client.setToken(response.token);
        // TODO: redirect to home page or account overview
      })
      .catch((error) => {
        toastr.error("Failed to login:", error)
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
            <h3>Welcome to Bitto</h3>
            <p>Login in to play</p>
            <form className="m-t" onSubmit={this.handleSubmit} >
                <div className="form-group">
                    <input type="text" className="form-control" placeholder="Username" required="" onChange={this.handleChange} id="username" />
                </div>
                <div className="form-group">
                    <input type="password" className="form-control" placeholder="Password" required="" onChange={this.handleChange} id="password" />
                </div>
                <button type="submit" className="btn btn-primary block full-width m-b">Login</button>

                <Link to="/password/reset"><small>Forgot password?</small></Link>
                <p className="text-muted text-center"><small>Do not have an account?</small></p>
                <Link className="btn btn-sm btn-white btn-block" to="/signup">Create an account</Link>
            </form>
        </div>
    </div>
    )
  }
}

export default Signup
