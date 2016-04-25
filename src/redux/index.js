import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import chat from './chat';
import login from './login';
import navigation from './navigation';
import primus from './primus';

const rootReducer = combineReducers({
  chat,
  login,
  navigation,
  primus,
  routing,
});

export default rootReducer;
