import gql from 'graphql-tag'

export const BOOKS_SUBSCRIPTION = gql`
  subscription {
    onBookAdded() {
      title
      writerId
      writer {
        name
      }
    }
  }
`
