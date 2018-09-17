import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import Settings from './Settings';
import ToDo from './ToDo';
import Auth from './Auth';

const reducers = combineReducers({
  routing: routerReducer,
  settings: Settings,
  toDo: ToDo,
  auth: Auth
});

export default reducers;
