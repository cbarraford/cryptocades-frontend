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
        console.log(response);
        this.props.history.push("/login")
      })
      .catch((error) => {
        toastr.error("Failed to create account: " + error)
        console.log(error)
      })
  }

  render() {
    return (
      <div className="col-md-4 col-md-offset-4 middle-box text-center loginscreen animated fadeInDown">
        <div>
            <div>
                <h1 className="logo-name">Bitto</h1>
            </div>
            <h3>Sign Up for Bitto</h3>
            <p>Create account to earn your chance to win Bitcoin.</p>
            <form className="m-t" onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <input type="text" className="form-control" placeholder="Username" required="" onChange={this.handleChange} id="username" />
                </div>
                <div className="form-group">
                    <input type="email" className="form-control" placeholder="Email" required="" onChange={this.handleChange} id="email" />
                </div>
                <div className="form-group">
                    <input type="password" className="form-control" placeholder="Password" required="" onChange={this.handleChange} id="password" />
                </div>
                <div className="form-group">
                    <input type="password" className="form-control" placeholder="Password again" required="" onChange={this.handleChange} id="password2" />
                </div>
                <div className="form-group">
                    <input type="text" className="form-control" placeholder="Bitcoin Address" pattern="^[13][a-km-zA-HJ-NP-Z0-9]{26,33}$" title="Must be a valid bitcoin address" required="" onChange={this.handleChange} id="btc_address" />
                </div>
                <button type="submit" className="btn btn-primary block full-width m-b">Register</button>

                <p className="text-muted text-center"><small>Already have an account?</small></p><Link className="btn btn-sm btn-white btn-block" to="/login">Login</Link>
            </form>
        </div>
    </div>
    )
  }
}

export default Signup
