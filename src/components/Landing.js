import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

class Landing extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({[event.target.id]: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.history.push("/play/"+this.state.btc_address)
  }

  render() {
    return (
      <div>
      <div className="navbar-wrapper">
        <nav className="navbar navbar-default navbar-fixed-top" role="navigation">
            <div className="container">
                <div className="navbar-header page-scroll">
                    <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                    <Link className="navbar-brand" to="/signup">Sign Up</Link>
                </div>
                <div id="navbar" className="navbar-collapse collapse">
                    <ul className="nav navbar-nav navbar-right">
                        <li><a className="page-scroll" href="#page-top">Home</a></li>
                        <li><a className="page-scroll" href="#features">Features</a></li>
                        <li><a className="page-scroll" href="#works">How it works</a></li>
                    </ul>
                </div>
            </div>
        </nav>
</div>
<div id="inSlider" className="carousel carousel-fade" data-ride="carousel">
    <div className="carousel-inner" role="listbox">
        <div className="item active">
            <div className="container">
                <div className="carousel-caption">
                    <h1>Win the Lottery<br/>
                        without buying<br/>
                        a ticket<br/>
                        </h1>
                    <p>Every week we give away $100+ of Bitcoin</p>
                    <p>
                      <Link className="btn btn-lg btn-primary" to="/signup">Sign Up</Link>
                    </p>
                </div>
            </div>
            <div className="header-back one"></div>

        </div>
    </div>
</div>

<section id="features" className="container services">
    <div className="row">
        <div className="col-sm-3">
            <h2>Free to play</h2>
            <p>Its completely free to play! No credit card, bank account, or anything! Just open your browser and you are good to go.</p>
        </div>
        <div className="col-sm-3">
            <h2>No sign-ups!</h2>
            <p>No need to sign up, play completely privately. We do not ask for your name, location, or even email address.</p>
        </div>
        <div className="col-sm-3">
            <h2>Earn $$ while you sleep</h2>
            <p>Leave your computer earning $$ while you sleep or while you're away at work. The longer you leave your browser up, the greater chance you have to win!</p>
        </div>
        <div className="col-sm-3">
            <h2>Pays out Weekly</h2>
            <p>Every week we pay out $100 or more to people. Winners get the jackpot sent to their bitcoin wallet. No bank accounts, email addresses, home addresses, or other personal information.</p>
        </div>
    </div>
</section>

<section id="play_now" className="navy-section testimonials" style={{ marginTop: 0}}>

    <div className="container">
        <div className="row">
            <div className="col-lg-12 text-center wow zoomIn">
                <i className="fa fa-btc big-icon"></i>
                <h1>
                  Enter you bitcoin address and start playing!
                </h1>
                <div className="col-sm-12">
                  <form onSubmit={this.handleSubmit}>
                  <div className="input-group m-b col-sm-6 col-sm-offset-3">
                    <input value={this.state.btc_address} onChange={this.handleChange} type="text" className="form-control" pattern="^[13][a-km-zA-HJ-NP-Z0-9]{26,33}$" placeholder="1MiJFQvupX5kSZcUtfSoD9NtLevUgjv3uq" title="Must be a valid bitcoin address" /> 
                    <span className="input-group-btn"><button type="submit" className="btn btn-info">Go!</button></span>
                  </div>
                  </form>
                </div>
                <div className="row">
                <small>
                    <strong>(do not enter your bitcoin private key)</strong>
                </small>
                </div>
            </div>
        </div>
    </div>

</section>

<section id="works" className="features" style={{ marginTop: 0}}>
      <div className="container">
        <div className="row">
            <div className="col-lg-12 text-center">
                <div className="navy-line"></div>
                <h1>How it works?</h1>
                <p>An overview of how WinCoin works</p>
            </div>
        </div>
        <div className="row">
            <div className="col-lg-5 col-lg-offset-1 features-text">
                <small>Mining</small>
                <h2>CryptoCurrency Mining</h2>
                <i className="fa fa-money big-icon pull-right"></i>
                <p>While your browser is playing the game, the game utilizes the computing power of your computer to mine a cryptocurrency. The more powerful your computer the more you mine and the more tokens you earn. You can then place those tokens into a lottery of your choosing to win big $$. Have your computer work for you while you sleep or are away at work!</p>
            </div>
        </div>
    </div>
</section>
      </div>
    );
  }
}

export default Landing;
