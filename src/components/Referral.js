import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import toastr from 'toastr'
import { FacebookButton, TwitterButton } from "react-social";
import {CopyToClipboard} from 'react-copy-to-clipboard';

@inject('store')
@inject('client')
@observer
class Referral extends Component {
  constructor (props) {
    super(props)

    let baseURL = '';
    if (process.env.NODE_ENV === 'staging') {
      // TODO: remove staging address from client side code
      baseURL = 'https://staging-app.cryptocades.com';
    } else if (process.env.NODE_ENV === 'production') {
      baseURL = 'https://app.cryptocades.com';
    } else {
      baseURL = 'http://localhost:3000';
    }

    this.state = {
      baseURL: baseURL,
    }

  }

  render() {
    const { referral_code } = this.props.store.me
    const referral_url = this.state.baseURL + "/signup?referral=" + referral_code
    const message = "Get a free BOOST when you sign up for #Cryptocades with my referral code!"
    const fbStyle = { color: "#3b5998", fontSize: "3em", margin: "3px" }
    const twitterStyle = { color: "#00aced", fontSize: "3em", margin: "3px" }
    return (
      <div className="page-container" style={{minHeight: "262px"}}>
        <div className="page-content">
          <div className="content-wrapper" style={{color: "#266586"}}>

            <div className="text-center">
              <h1 className="content-group text-semibold content-header text-center">
                Win when your friends win, plus get a free boost!
              </h1>
              <h3>Referral Program</h3>
              <p>Refer a friend and when they win a Bitcoin jackpot, you win an additional 10% of their winnings! Plus, both you and your friend gets one free boost. A boost doubles the number of jackpot plays you earn in a single game session. Note: Referring yourself or a fake account will disqualify your eligibility to be a jackpot winner and may terminate your account(s).</p>
            </div>
            <div className="row">
              <div className="form-group">
                <div className="input-group col-md-6 col-md-offset-3">
                  <input type="text" className="form-control" value={referral_url} readOnly />
                  <span className="input-group-btn">
                    <CopyToClipboard text={referral_url}
                      onCopy={() => toastr.success("Copied to clipboard")}>
                      <button className="btn" type="button" style={{backgroundColor: "#266586", color: "white"}}>Copy to Clipboard</button>
                    </CopyToClipboard>
                  </span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 col-md-offset-5">
                <div className="pull-right">
                  Share:
                  <FacebookButton title="Share via facebook!" element='a' url={referral_url} message={message} appId='785415074997932'>
                    <i className="icon-facebook2" style={fbStyle}></i>
                  </FacebookButton>
                  <TwitterButton title="Share via twitter!" element='a' url={referral_url} message={message}>
                    <i className="icon-twitter2" style={twitterStyle}></i>
                  </TwitterButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Referral
