import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import UserNav from '../components/UserNav';
import GuestNav from '../components/GuestNav';
import SecondNav from '../components/SecondNav';
import ReactGA from 'react-ga';

ReactGA.initialize('UA-113906692-1');

@inject('store')
@inject('client')
@observer
class DefaultLayout extends Component {

  constructor(props){
    super(props)

    // send pageview to google analytics
    ReactGA.pageview(window.location.pathname + window.location.search);

    this.props.client.me()
      .then((response) => {
        this.props.store.me = response.data
      })
      .catch((error) => {
        console.log(error)
        this.props.store.me = {}
      })

    this.props.client.btcPrice()
      .then((response) => {
        this.props.store.btcPrice = response.data
      })
      .catch((error) => {
        this.props.client.handleError(error, "Failed to get Bitcoin price")
      })


  }

  render() {
    // TODO: be more dry about these rendered returns 

    const { logged_in } = this.props.store

    if (logged_in) {
      return (
        <div>
          <UserNav />
          <SecondNav />
          <div className="row">
            { this.props.children }
          </div>
        </div>
      )
    }

    return (
      <div>
        <GuestNav />
        <SecondNav />
        <div className="row">
          { this.props.children }
        </div>
      </div>
    );
  }
}

export default DefaultLayout;
