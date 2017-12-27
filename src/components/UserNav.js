import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom'

@inject('store')
@inject('client')
@observer
class DefaultLayout extends Component {

  render() {
    const { me } = this.props.store;

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
            <div className="navbar-collapse collapse" id="navbar">
                <ul className="nav navbar-top-links navbar-right">
                    <li>
                        <Link to="/logout">
                            <i className="fa fa-sign-out"></i> Log out
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
      </div>
      </div>
      </div>
  );
  }
}

export default DefaultLayout;
