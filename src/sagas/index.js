import { all } from 'redux-saga/effects';
import toDoSagas from './Todo';
import authSagas from './Auth';

export default function* rootSaga(getState) {
  yield all([toDoSagas(), authSagas()]);
}
