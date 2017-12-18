import React, { Component } from 'react';

class DefaultLayout extends Component {

  render() {
      return (
        <div className="wrapper">
        <div id="page-wrapper" className="gray-bg" >
          <div className="row border-bottom white-bg">
          <nav className="navbar navbar-static-top" role="navigation">
            <div className="navbar-header">
              <a href="/" className="navbar-brand">Win Coin</a>
            </div>
          </nav>
          </div>
          <div className="row">
            { this.props.children }
          </div>
        </div>
        </div>
    );
  }
}

export default DefaultLayout;
