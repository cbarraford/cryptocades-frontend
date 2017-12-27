import React, { Component } from 'react';

class GuestNav extends Component {

  render() {

    return (
      <div id="wrapper">
      <div id="page-wrapper" className="gray-bg">
      <div className="row border-bottom white-bg">
        <nav className="navbar navbar-static-top" role="navigation">
            <div className="navbar-header">
                <button aria-controls="navbar" aria-expanded="false" data-target="#navbar" data-toggle="collapse" className="navbar-toggle collapsed" type="button">
                    <i className="fa fa-reorder"></i>
                </button>
                <a href="#" className="navbar-brand">Bitto</a>
            </div>
        </nav>
      </div>
      </div>
      </div>
  );
  }
}

export default GuestNav;
