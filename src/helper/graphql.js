import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  clientState: {
    defaults: {
      key: 'prout'
    },
    resolvers: {},
    typeDefs: `
      type Query {
       key: String
      }
    `
  }
});

export default client;
