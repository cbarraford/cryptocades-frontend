import React from 'react';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/createBrowserHistory'
import { Provider } from 'mobx-react';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import { Router, Route } from 'react-router-dom'

import DefaultLayout from './layouts/DefaultLayout'

import './index.css';
import Landing from './components/Landing';
import Signup from './components/Signup';
import ForgetPassword from './components/ForgetPassword';
import ResetPassword from './components/ResetPassword';
import Confirmation from './components/Confirmation';
import Login from './components/Login';
import Logout from './components/Logout';
import Tower from './components/Tower';
import Games from './components/Games';
import Jackpots from './components/Jackpots';
import Entries from './components/Entries';
import Profile from './components/Profile';
import Referral from './components/Referral';
import registerServiceWorker from './registerServiceWorker';

import Store from './Store'
import Client from './Client'
Client.setToken(Store.token)

const stores = {
  store: Store,
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
      <MatchWithDefaultLayout exact path="/signup" component={Signup}/>
      <MatchWithDefaultLayout exact path="/password/forget" component={ForgetPassword}/>
      <MatchWithDefaultLayout exact path="/password/reset/:code" component={ResetPassword}/>
      <MatchWithDefaultLayout exact path="/confirmation/:code" component={Confirmation}/>
      <MatchWithDefaultLayout exact path="/confirmation" component={Confirmation}/>
      <MatchWithDefaultLayout exact path="/login" component={Login}/>
      <Route exect path="/logout" component={Logout}/>
      <MatchWithDefaultLayout exact path="/jackpots" component={Jackpots}/>
      <MatchWithDefaultLayout exact path="/games" component={Games}/>
      <MatchWithDefaultLayout exact path="/games/:game_id" component={Tower}/>
      <MatchWithDefaultLayout exact path="/games/:game_id/:user_id" component={Tower}/>
      <MatchWithDefaultLayout exact path="/entries" component={Entries}/>
      <MatchWithDefaultLayout exact path="/profile" component={Profile}/>
      <MatchWithDefaultLayout exact path="/referral" component={Referral}/>
    </div>
  </Router>
  </Provider>
), document.getElementById('root'));

registerServiceWorker();
