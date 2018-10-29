import gql from 'graphql-tag'

export const GET_WRITER_AND_BOOKS = gql`
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
