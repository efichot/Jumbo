import React, { useState, useContext, Suspense } from 'react'
import { useApolloQuery } from 'react-apollo-hooks'
import Context from 'context'
import gql from 'graphql-tag'
import CircularProgress from '@material-ui/core/CircularProgress'
import ButtonBase from '@material-ui/core/ButtonBase'
import Typography from '@material-ui/core/Typography'

const GET_BOOKS = gql`
  query {
    books {
      title
      writerId
      writer {
        name
      }
    }
  }
`

const Books = () => {
  const { data, error } = useApolloQuery(GET_BOOKS)
  if (error) return `Error! ${error.message}`

  return (
    <ul>
      {data.books.map(book => (
        <li key={book.title}>
          {book.title} by {book.writer.name}
        </li>
      ))}
    </ul>
  )
}

export default function (props) {
  const context = useContext(Context)
  const [value, setValue] = useState('4')
  const [input, setInput] = useState('')
  const [display, setDisplay] = useState(false)

  return (
    <div className='d-flex flex-column align-items-center'>
      {value}
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button
        onClick={e => {
          setValue(input)
          setInput('')
        }}
      >
        Change Value
      </button>
      <small>{context.auth.authUser.displayName}</small>
      <hr />
      <h3>Apollo Client</h3>
      {display &&
        <Suspense fallback={<CircularProgress color='secondary' />}>
          <Books />
        </Suspense>}
      <ButtonBase
        focusRipple
        onClick={e => setDisplay(!display)}
        key='Blue Bird'
        className='complex-btn ripple-effect'
        style={{
          width: '100%'
        }}
      >
        <div
          className='img-src'
          style={{
            backgroundImage: `url(${'https://d1ia71hq4oe7pn.cloudfront.net/photo/63740061-1280px.jpg'})`
          }}
        />
        <div className='img-btn-overlay' />
        <div className='img-btn'>
          <Typography
            component='h3'
            type='subheading'
            color='inherit'
            className='img-title'
          >
            Blue Bird
            <div className='img-marked' />
          </Typography>
        </div>
      </ButtonBase>
    </div>
  )
}
