import ApolloClient from 'apollo-boost'
import gql from 'graphql-tag'

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
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
