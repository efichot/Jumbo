import React from 'react';
import { ConnectedRouter } from 'react-router-redux';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import configureStore, { history } from './store';
import './helper/firebase';
import App from './containers/App';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';

export const store = configureStore();
const pStore = persistStore(store);

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT
});

const MainApp = () => (
  <Provider store={store}>
    <PersistGate persistor={pStore}>
      <ConnectedRouter history={history}>
        <ApolloProvider client={client}>
          <Switch>
            <Route path="/" component={App} />
          </Switch>
        </ApolloProvider>
      </ConnectedRouter>
    </PersistGate>
  </Provider>
);

export default MainApp;
