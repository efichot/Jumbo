import gql from 'graphql-tag'

export const ADD_BOOK = gql`
  mutation($title: String!, $writer: String!) {
    addBook(title: $title, writer: $writer) {
      title
      writerId
    }
  }
`
