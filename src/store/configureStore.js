import rootReducer from '~/redux';
import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';

export default function configureStore(initialState) {
  let middleware = [thunkMiddleware];

  if (process.env.NODE_ENV === 'development') {
    middleware = [...middleware, require('redux-logger')({ collapsed: true })];
  }

  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(...middleware)
  );

  return store;
}
