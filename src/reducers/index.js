import { combineReducers } from 'redux';
import Settings from './Settings';
import Auth from './Auth';

const reducers = combineReducers({
  settings: Settings,
  auth: Auth
});

export default reducers;
