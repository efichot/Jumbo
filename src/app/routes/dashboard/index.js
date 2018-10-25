import React, { Component } from 'react'
import { connect } from 'react-redux'
import ContainerHeader from 'components/ContainerHeader/index'
import IntlMessages from 'util/IntlMessages'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import CircularProgress from '@material-ui/core/CircularProgress'
import { NotificationManager } from 'react-notifications'
import client from 'helper/graphql'
import StripeCheckout from 'react-stripe-checkout'
import { CardActions } from '@material-ui/core'
import { functions } from 'helper/firebase'
import CustomScrollbars from 'util/CustomScrollbars'

const GET_WRITER_AND_BOOKS = gql`
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

const ADD_BOOK = gql`
  mutation($title: String!, $writer: String!) {
    addBook(title: $title, writer: $writer) {
      title
      writerId
    }
  }
`

export class Dashboard extends Component {
  state = {
    writer: '',
    title: '',
    writer2: '',
    buttonClicked: false,
    loading: false,
    apolloStore: null
  }

  onToken = async token => {
    try {
      const res = await functions.httpsCallable(
        'saveStripeTokenAndCreateStripeUser'
      )({ token })
      const { done, message } = res.data
      if (!done) {
        NotificationManager.error(message)
      } else {
        console.log(message)
      }
    } catch (e) {
      NotificationManager.error(e)
    }
  }

  handleClickRandomPosition = () => {
    const { scrollbars } = this.refs.scrollbars.refs
    scrollbars.view.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  }

  displayStore = async () => {
    this.setState({ loading: true })
    const { data } = await client.query({
      query: gql`
        {
          key @client
        }
      `
    })
    setTimeout(() => {
      this.setState({ apolloStore: data, loading: false })
    }, 500)
  }

  render () {
    const { buttonClicked, loading, apolloStore, title, writer2 } = this.state
    return (
      <div className='app-wrapper'>
        <div className='dashboard animated slideInUpTiny animation-duration-5'>
          <ContainerHeader
            match={this.props.match}
            title={<IntlMessages id='sidebar.dashboard' />}
          />
          <div className='row'>
            <div className='col-12 col-md-7 mb-3'>
              <Card>
                <CardContent>
                  <h4>Retrieve a Book by writer on the Graphql end point</h4>
                  <div className='d-flex align-items-center'>
                    <TextField
                      id='outlined-name'
                      label='Writer'
                      value={this.state.writer}
                      onChange={e =>
                        this.setState({
                          writer: e.target.value,
                          buttonClicked: false
                        })}
                      margin='normal'
                      variant='outlined'
                    />
                    <Button
                      className='jr-btn ml-auto'
                      color='primary'
                      variant='contained'
                      onClick={() => this.setState({ buttonClicked: true })}
                    >
                      <i className='zmdi zmdi-search zmdi-hc-fw' />
                      <span>Search</span>
                    </Button>
                    <Button
                      className='jr-btn'
                      color='secondary'
                      variant='contained'
                      onClick={() => {
                        client.writeData({
                          data: { key: this.state.writer }
                        })
                      }}
                    >
                      <i className='zmdi zmdi-format-valign-bottom' />
                      <span>Change Cache</span>
                    </Button>
                  </div>
                  {buttonClicked &&
                    <Query
                      query={GET_WRITER_AND_BOOKS}
                      variables={{ writerName: this.state.writer }}
                    >
                      {({ loading, data }) => {
                        if (loading) {
                          return (
                            <div className='d-flex justify-content-center'>
                              <CircularProgress />
                            </div>
                          )
                        }
                        if (data && data.writer) {
                          return (
                            <div>
                              <h1>{data.writer.name}</h1>
                              <div className='d-flex flex-column'>
                                {data.writer.books.map((book, index) => (
                                  <small key={index} className='text-grey'>
                                    {book.title}
                                  </small>
                                ))}
                              </div>
                            </div>
                          )
                        } else {
                          NotificationManager.error(
                            'No writer find with this name'
                          )
                          return ''
                        }
                      }}
                    </Query>}
                </CardContent>
              </Card>
            </div>
            <div className='col-12 col-md-5 mb-3'>
              <Card>
                <CardContent className='d-flex justify-content-center'>
                  <h4>
                    Payment with STRIPE{' '}
                    <span role='img' aria-label='card'>
                      💳
                    </span>
                  </h4>
                </CardContent>
                <CardActions className='d-flex justify-content-center'>
                  <StripeCheckout
                    token={this.onToken}
                    className='d-flex justify-content-center'
                    stripeKey={process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}
                  />
                </CardActions>
              </Card>
            </div>

            <div className='col-12 col-md-5'>
              <Card>
                <CardContent>
                  <CustomScrollbars
                    className='scrollbar'
                    style={{
                      height: '400px'
                    }}
                    ref='scrollbars'
                  >
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    ke <br />
                    <button onClick={this.handleClickRandomPosition}>
                      Scroll to top
                    </button>
                  </CustomScrollbars>
                </CardContent>
              </Card>
            </div>
            <div className='col-12 col-md-7'>
              <Card>
                <CardContent>
                  <h3>
                    Mutation with graphql and access to store of apollo client
                  </h3>
                  <Button
                    variant='contained'
                    color='primary'
                    className='jr-btn-xs'
                    disabled={loading}
                    onClick={this.displayStore}
                  >
                    Display store
                    {loading &&
                      <CircularProgress
                        size={24}
                        className='text-green position-absolute'
                      />}
                  </Button>
                </CardContent>
                {apolloStore && <h1>{apolloStore.key}</h1>}
                <h4 className='ml-3'>Add a book</h4>
                <div className='d-flex justify-content-around align-items-center'>
                  <TextField
                    id='outlined-name'
                    label='Writer'
                    className=''
                    value={this.state.writer2}
                    onChange={e => this.setState({ writer2: e.target.value })}
                    margin='normal'
                    variant='outlined'
                  />
                  <TextField
                    id='outlined-book'
                    label='Title'
                    value={this.state.title}
                    onChange={e => this.setState({ title: e.target.value })}
                    className=''
                    margin='normal'
                    variant='outlined'
                  />
                  <Mutation
                    mutation={ADD_BOOK}
                    variables={{ title, writer: writer2 }}
                  >
                    {mutation => (
                      <Button
                        variant='outlined'
                        color='primary'
                        className='jr-btn-xs'
                        onClick={mutation}
                      >
                        Add book
                      </Button>
                    )}
                  </Mutation>

                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({})

export default connect(mapStateToProps, {})(Dashboard)
