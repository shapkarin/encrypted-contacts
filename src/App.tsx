import React, { Component } from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createHashHistory } from 'history';

import store from './Store';
import Contacts from './Pages/Contacts';
import Auth from './Pages/Auth';
import WithAuth from './WithAuthHOC';

const history = createHashHistory();

export default function App() {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Switch>
          <Route path="/" component={Auth} />
          {/* <Route path="/contacts" component={WithAuth(Contacts)} /> */}
          <Route path="/contacts" component={Contacts} />
        </Switch>
      </Router>
    </Provider>
  );
}
