import rootReducer from '~/redux';
import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';

export default function configureStore(initialState) {
  let middleware = [thunkMiddleware];

  if (global.__DEV__) {
    middleware = [...middleware, require('redux-logger')({ collapsed: true })];
  }

  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(...middleware)
  );

  return store;
}
