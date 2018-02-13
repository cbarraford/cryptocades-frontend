import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom'
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
    const style = { fontSize: "3em", margin: "3px" }
    return (
      <div className="page-container" style={{minHeight: "262px"}}>
        <div className="page-content">
          <div className="content-wrapper">
            <div className="jumbotron">
              <h1 className="display-3">"Tell for Ten" Referral Program</h1>
              <p className="lead">Tell a friend to sign up with your referral url and both of you get 10 free plays (limited to 10 referrals)</p>
            </div>
            <div className="row">
              <div className="form-group">
                <label className="control-label col-lg-1">Referral URL</label>
                <div className="col-lg-6">
                  <div className="input-group">
                    <input type="text" className="form-control" value={referral_url} readOnly />
                    <span className="input-group-btn">
                      <CopyToClipboard text={referral_url}
                        onCopy={() => toastr.success("Copied to clipboard")}>
                        <button className="btn bg-green" type="button">Copy to Clipboard</button>
                      </CopyToClipboard>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div className="row">
              <FacebookButton title="Share via facebook!" element='a' url={referral_url} message={message} appId='785415074997932'>
                <i className="icon-facebook2" style={style}></i>
              </FacebookButton>
              <TwitterButton title="Share via twitter!" element='a' url={referral_url} message={message}>
                <i className="icon-twitter2" style={style}></i>
              </TwitterButton>
            </div>
          </div>
          <p>
            <small className="text-muted">*limited to ten referrals maximum</small>
          </p>
        </div>
      </div>
    )
  }
}

export default Referral
