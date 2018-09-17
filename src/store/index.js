import {applyMiddleware, compose, createStore} from "redux";
import { createLogger } from 'redux-logger'
import reducers from "../reducers/index";
import createHistory from "history/createHashHistory";
import createSagaMiddleware from "redux-saga";
import rootSaga from "../sagas/index";
import {routerMiddleware} from "react-router-redux";
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';


const history = createHistory();
const routeMiddleware = routerMiddleware(history);
const sagaMiddleware = createSagaMiddleware();
const logger = createLogger();
const persistConfig = {
  key: 'root',
  storage,
}

const middlewares = [sagaMiddleware, routeMiddleware, logger];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const pReducer = persistReducer(persistConfig, reducers);

export default function configureStore(initialState) {
  const store = createStore(pReducer, initialState,
    composeEnhancers(applyMiddleware(...middlewares)));
  sagaMiddleware.run(rootSaga);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers/index', () => {
      const nextRootReducer = require('../reducers/index');
      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}
export {history};
