import React from 'react';
import { IndexRedirect, Route } from 'react-router';
import App from '~/containers/App';
import Chat from '~/containers/Chat';
import Login from '~/containers/Login';

export default function routes(store) {
  function requireLogin(nextState, replace) {
    if (!store.getState().login.loggedIn && nextState.location.pathname !== '/login') {
      replace({
        pathname: '/login',
        state: { nextPathname: nextState.location.pathname },
      });
    } else if (store.getState().login.loggedIn && nextState.location.pathname === '/login') {
      replace({
        pathname: '/chat',
        state: { nextPathname: nextState.location.pathname },
      });
    }
  }

  return (
    <Route path="/" component={App}>
      <IndexRedirect to="login" />
      <Route path="chat" component={Chat} onEnter={requireLogin} />
      <Route path="login" component={Login} onEnter={requireLogin} />
      <Route path="*" onEnter={requireLogin} />
    </Route>
  );
}
