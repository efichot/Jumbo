import { ApolloClient } from 'apollo-client'
// import { getMainDefinition } from 'apollo-utilities'
// import { ApolloLink, split } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
// import { WebSocketLink } from 'apollo-link-ws'
import { InMemoryCache } from 'apollo-cache-inmemory'
import gql from 'graphql-tag'

const link = new HttpLink({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT
})

// if Websocket needed

// const wsLink = new WebSocketLink({
//   uri: process.env.REACT_APP_WS_GRAPHQL,
//   options: {
//     reconnect: true
//   }
// })

// const terminatingLink = split(
//   ({ query }) => {
//     const { kind, operation } = getMainDefinition(query)
//     return kind === 'OperationDefinition' && operation === 'subscription'
//   },
//   wsLink,
//   httpLink
// )

// const link = ApolloLink.from([terminatingLink])

const cache = new InMemoryCache()

const client = new ApolloClient({
  link,
  cache,
  clientState: {
    defaults: {
      key: 'prout'
    },
    resolvers: {},
    typeDefs: gql`
      type Query {
        key: String
      }
    `
  }
})

export default client
