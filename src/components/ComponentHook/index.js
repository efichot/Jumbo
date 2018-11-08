import React, { useState, useContext, Suspense, useEffect } from 'react'
import { useApolloQuery } from 'react-apollo-hooks'
import Context from 'context'
import CircularProgress from '@material-ui/core/CircularProgress'
import ButtonBase from '@material-ui/core/ButtonBase'
import Typography from '@material-ui/core/Typography'
import { Formik } from 'formik'
import { TextField, Button } from '@material-ui/core'
import { GET_BOOKS } from '../../graphql/Queries'
import { ADD_BOOK } from '../../graphql/Mutations'
import { Mutation } from 'react-apollo'
import { NotificationManager } from 'react-notifications'

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

  useEffect(
    () => {
      console.log('lol')
    },
    [value]
  )

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
      <Mutation
        mutation={ADD_BOOK}
        update={(cache, { data: { addBook } }) => {
          const { books } = cache.readQuery({ query: GET_BOOKS })
          books.push(addBook)
          cache.writeQuery({
            query: GET_BOOKS,
            data: { books }
          })
        }}
      >
        {(mutation, { data, loading, error }) => {
          if (error) NotificationManager.error(error.message)

          return (
            <Formik
              initialValues={{
                writer: '',
                book: ''
              }}
              onSubmit={async ({ writer, book }, { resetForm }) => {
                const res = await mutation({
                  variables: {
                    title: book,
                    writer
                  }
                })
                if (res) {
                  NotificationManager.success(
                    `Book Added ${res.data.addBook.title}!`
                  )
                }
                resetForm()
              }}
            >
              {({ values, handleChange, handleSubmit }) => (
                <form className='d-flex align-items-center mt-2'>
                  <TextField
                    name='writer'
                    label='Writer'
                    value={values.writer}
                    onChange={handleChange}
                    variant='outlined'
                  />
                  <TextField
                    name='book'
                    label='Book'
                    value={values.book}
                    onChange={handleChange}
                    variant='outlined'
                  />
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    Primary
                    {loading &&
                      <CircularProgress
                        size={24}
                        className='text-green position-absolute'
                      />}
                  </Button>

                </form>
              )}
            </Formik>
          )
        }}
      </Mutation>
    </div>
  )
}
