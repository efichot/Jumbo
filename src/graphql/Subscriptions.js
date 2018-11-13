import gql from 'graphql-tag'

export const NEW_BOOK = gql`
  subscription newBook {
    newBook {
      title
      writerId
    }
  }
`
