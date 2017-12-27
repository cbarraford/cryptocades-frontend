import React from 'react';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/createBrowserHistory'
import { Provider } from 'mobx-react';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import { BrowserRouter as Router, Route } from 'react-router-dom'

import DefaultLayout from './layouts/DefaultLayout'

import './index.css';
import Landing from './components/Landing';
import Signup from './components/Signup';
import Login from './components/Login';
import Play from './components/Play';
import registerServiceWorker from './registerServiceWorker';

import Store from './Store'
import Client from './Client'
Client.setToken(Store.token)

const stores = {
  route: Store,
  client: Client,
};

const browserHistory = createBrowserHistory();
const routingStore = new RouterStore();
const history = syncHistoryWithStore(browserHistory, routingStore);


const MatchWithDefaultLayout = ({ path, component: Component }: any) => {
  return (
    <Route exact path={path} render={(props: any) => (
      <DefaultLayout><Component {...props} /></DefaultLayout>
    )} />
  );
};

ReactDOM.render((
  <Provider {...stores}>
  <Router history={history}>
    <div>
      <Route exact path="/" component={Landing}/>
      <Route exact path="/signup" component={Signup}/>
      <Route exact path="/login" component={Login}/>
      <MatchWithDefaultLayout path="/play/:address" component={Play}/>
    </div>
  </Router>
  </Provider>
), document.getElementById('root'));

registerServiceWorker();
