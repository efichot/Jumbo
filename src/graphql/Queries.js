import gql from 'graphql-tag'

export const GET_WRITER = gql`
  query($writerName: String!) {
    writer(name: $writerName) {
      id
      name
      books {
        title
      }
    }
  }
`

export const GET_BOOKS = gql`
  query {
    books {
      title
      writer {
        name
      }
    }
  }
`
