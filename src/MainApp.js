import React from 'react'
import { Provider } from 'react-redux'
import { Route, Switch, BrowserRouter } from 'react-router-dom'
import configureStore from './store'
import './helper/firebase'
import App from './containers/App'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { ApolloProvider } from 'react-apollo'
import client from 'helper/graphql'

export const store = configureStore()
const pStore = persistStore(store)

const MainApp = () => (
  <Provider store={store}>
    <PersistGate persistor={pStore}>
      <BrowserRouter>
        <ApolloProvider client={client}>
          <Switch>
            <Route path='/' component={App} />
          </Switch>
        </ApolloProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
)

export default MainApp
