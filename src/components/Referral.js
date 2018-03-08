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
      baseURL = 'https://staging.cryptocades.com';
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
    const message = "Get 10 free plays when you sign up for #Cryptocades with my referral code!"
    const fbStyle = { color: "#3b5998", fontSize: "3em", margin: "3px" }
    const twitterStyle = { color: "#00aced", fontSize: "3em", margin: "3px" }
    return (
      <div className="page-container" style={{minHeight: "262px"}}>
        <div className="page-content">
          <div className="content-wrapper" style={{color: "#266586"}}>

            <div className="text-center">
              <h1 className="content-group text-semibold content-header text-center">
                Free Plays
              </h1>
              <h3>Referral Program</h3>
              <p>Tell a friend to sign up with your referral url and both of you and your friend get 10 free plays (limited to 10 referrals)</p>
            </div>
            <div className="row">
              <div className="form-group">
                <div className="input-group col-lg-6 col-lg-offset-3">
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
              <div className="col-lg-4 col-lg-offset-5">
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
