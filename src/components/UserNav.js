import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom'

@inject('store')
@inject('client')
@observer
class UserNav extends Component {

  constructor(props) {
    super(props)

    this.state = {
      jackpots: [],
      total_entries: 0,
      my_entries: 0,
      pending_entries: 0,
    }

    this.props.client.balance()
      .then((response) => {
        this.props.store.balance = response.data.balance
      })
      .catch((error) => {
        console.log(error)
      })

    this.props.client.listJackpots()
      .then((response) => {
        this.setState({
          jackpots: response.data,
        })
      })
      .catch((error) => {
        console.log(error)
      })

    window.onresize = (e) => {
      let nav = document.getElementsByClassName('firstbar')[0]
      nav.style.height = document.body.clientWidth / 9.3 + "px"
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({[event.target.id]: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.jackpots.length > 0) {
      const id = this.state.jackpots[0].id
      const amount = parseInt(this.state.pending_entries, 10);
      this.props.client.jackpotEnter(id, amount)
        .then((response) => {
          this.setState({ pending_entries: 0 }, () => {
            this.refs.pending_entries.value = 0
          })
          this.props.client.balance()
            .then((response) => {
              this.props.store.balance = response.data.balance
            })
            .catch((error) => {
              console.log(error)
            })
        })
        .catch((error) => {
          this.props.client.handleError(error, "Failed to enter into jackpot")
        })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    window.onresize();
  }

  render() {
    const { me, balance } = this.props.store;
    const avatar = (me.avatar || "").replace("\u0026", "&")
    const showTicketCount = balance > 0 ? "" : " hide"
    return (
      <div className="navbar navbar-default firstbar" style={{backgroundColor: "#266586"}}>
        <div className="navbar-header">
          <a className="navbar-brand" to="https://cryptocades.com"><img src="/img/logo.png" alt="" /></a>

          <ul className="nav navbar-nav pull-right visible-xs-block">
            <li><a data-toggle="collapse" data-target="#navbar-mobile"><i className="icon-tree5"></i></a></li>
          </ul>
        </div>

        <div className="navbar-collapse collapse" id="navbar-mobile">

          <ul className="nav navbar-nav navbar-right">
            <li className="dropdown dropdown-user">
              <a className="btn btn-icon" data-toggle="dropdown">
                <i className="icon-ticket"></i>
                <span className={"badge bg-warning-400" + showTicketCount} style={{paddingTop:0, paddingBottom:0}}>{balance || 0}</span>
              </a>
              <ul className="dropdown-menu dropdown-menu-right" style={{width: "400px", padding: 0}}>
                <div className="panel panel-flat" style={{margin:0}}>
                  <div className="panel-heading">
                    <h6 className="panel-title">{(balance || 0) === 0 ? "Sorry, you have no plays to enter into the jackpot. Play a game to earn plays!": "You have up to " + balance + " plays to enter!"}</h6>
                  </div>

                  <div className="panel-body">
                    <form onSubmit={this.handleSubmit}>
                      <div className="form-group has-feedback">
                        <input type="number" autoComplete="off" className="form-control" placeholder="Amount" onChange={this.handleChange} ref="pending_entries" id="pending_entries" />
                      </div>

                      <button type="submit" className="btn btn-block"style={{backgroundColor: "#266586", color: "#fdfbf0"}}>Enter Jackpot</button>
                    </form>
                  </div>
                </div>
              </ul>
            </li>
            <li className="dropdown dropdown-user" style={{width: "180px"}}>
              <a className="dropdown-toggle" data-toggle="dropdown">
                <img src={avatar} alt="" />
                <span>{me.username || "please wait..."}</span>
                <i className="caret"></i>
              </a>

              <ul style={{marginTop: 0}} className="dropdown-menu dropdown-menu-right">
                <li><Link to="/profile"><i className="icon-user-plus"></i> Profile</Link></li>
                <li><Link to="/wallet"><i className="icon-coins"></i> Wallet</Link></li>
                <li className="divider"></li>
                <li><Link to="/logout"><i className="icon-switch2"></i> Logout</Link></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default UserNav;
