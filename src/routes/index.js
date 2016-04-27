import React from 'react';
import { IndexRedirect, Route } from 'react-router';
import App from '~/containers/App';
import Chat from '~/containers/Chat';
import Login from '~/containers/Login';

function routes(store) {
  function requireLogin(nextState, replace) {
    const { loggedIn } = store.getState().login;
    const nextPathname = nextState.location.pathname;
    let pathname = null;

    if (!loggedIn && nextPathname !== '/login') {
      pathname = '/login';
    } else if (loggedIn && nextPathname === '/login') {
      pathname = '/chat';
    }

    if (pathname) {
      replace({
        pathname,
        state: { nextPathname },
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

export default routes;
