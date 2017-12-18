import React from 'react';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/createBrowserHistory'
import { BrowserRouter as Router, Route } from 'react-router-dom'


import DefaultLayout from './layouts/DefaultLayout'

import './index.css';
import Landing from './components/Landing';
import Play from './components/Play';
import registerServiceWorker from './registerServiceWorker';

const browserHistory = createBrowserHistory();


const MatchWithDefaultLayout = ({ path, component: Component }: any) => {
  return (
    <Route exact path={path} render={(props: any) => (
      <DefaultLayout><Component {...props} /></DefaultLayout>
    )} />
  );
};

ReactDOM.render((
  <Router history={browserHistory}>
    <div>
      <Route exact path="/" component={Landing}/>
      <MatchWithDefaultLayout path="/play/:address" component={Play}/>
    </div>
  </Router>
), document.getElementById('root'));

registerServiceWorker();
