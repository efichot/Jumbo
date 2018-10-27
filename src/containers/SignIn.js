import React from 'react'
import { Link } from 'react-router-dom'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import IntlMessages from 'util/IntlMessages'
import CircularProgress from '@material-ui/core/CircularProgress'
import iota from 'assets/images/iota_light.svg'
import { NotificationContainer, NotificationManager } from 'react-notifications'
import Context from 'context'

class SignIn extends React.Component {
  static contextType = Context

  state = {
    email: '',
    password: ''
  }

  componentDidMount = () => {
    const { auth: { authUser } } = this.context
    const { history } = this.props

    if (authUser !== null) {
      history.push('/')
    }
  }

  componentDidUpdate () {
    const { auth: { showMessage, authUser, hideMessage } } = this.context
    const { history } = this.props

    if (showMessage) {
      setTimeout(hideMessage, 100)
    }
    if (authUser !== null) {
      history.push('/')
    }
  }

  render () {
    const {
      auth: {
        showAuthLoader,
        userSignIn,
        showMessage,
        loader,
        alertMessage,
        userProviderSignIn
      }
    } = this.context
    const { email, password } = this.state

    return (
      <div className='app-login-container d-flex justify-content-center align-items-center animated slideInUpTiny animation-duration-3'>
        <div className='app-login-main-content'>
          <div className='app-logo-content d-flex align-items-center justify-content-center'>
            <Link className='logo-lg' to='/' title='Jambo'>
              <img
                src={iota}
                alt='jambo'
                title='jambo'
                style={{ width: '100%' }}
              />
            </Link>
          </div>

          <div className='app-login-content'>
            <div className='app-login-header mb-4'>
              <h1>
                <IntlMessages id='appModule.email' />
              </h1>
            </div>

            <div className='app-login-form'>
              <form>
                <fieldset>
                  <TextField
                    label={<IntlMessages id='appModule.email' />}
                    fullWidth
                    onChange={event =>
                      this.setState({ email: event.target.value })}
                    defaultValue={email}
                    margin='normal'
                    className='mt-1 my-sm-3'
                  />
                  <TextField
                    type='password'
                    label={<IntlMessages id='appModule.password' />}
                    fullWidth
                    onChange={event =>
                      this.setState({ password: event.target.value })}
                    defaultValue={password}
                    margin='normal'
                    className='mt-1 my-sm-3'
                  />

                  <div className='mb-3 d-flex align-items-center justify-content-between'>
                    <Button
                      onClick={() => {
                        showAuthLoader()
                        userSignIn(email, password)
                      }}
                      variant='contained'
                      color='primary'
                    >
                      <IntlMessages id='appModule.signIn' />
                    </Button>
                    <div className='d-flex flex-column'>
                      <Link to='/resetpass'>
                        <IntlMessages id='signIn.resetPass' />
                      </Link>
                      <Link to='/signup'>
                        <IntlMessages id='signIn.signUp' />
                      </Link>
                    </div>
                  </div>

                  <div className='app-social-block my-1 my-sm-3'>
                    <IntlMessages id='signIn.connectWith' />
                    <ul className='social-link'>
                      <li>
                        <IconButton
                          className='icon'
                          onClick={() => {
                            showAuthLoader()
                            userProviderSignIn('facebook')
                          }}
                        >
                          <i className='zmdi zmdi-facebook middle' />
                        </IconButton>
                      </li>

                      <li>
                        <IconButton
                          className='icon'
                          onClick={() => {
                            showAuthLoader()
                            userProviderSignIn('twitter')
                          }}
                        >
                          <i className='zmdi zmdi-twitter middle' />
                        </IconButton>
                      </li>

                      <li>
                        <IconButton
                          className='icon'
                          onClick={() => {
                            showAuthLoader()
                            userProviderSignIn('google')
                          }}
                        >
                          <i className='zmdi zmdi-google-plus middle' />
                        </IconButton>
                      </li>

                      <li>
                        <IconButton
                          className='icon'
                          onClick={() => {
                            showAuthLoader()
                            userProviderSignIn('github')
                          }}
                        >
                          <i className='zmdi zmdi-github middle' />
                        </IconButton>
                      </li>
                    </ul>
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
        {loader &&
          <div className='loader-view'>
            <CircularProgress />
          </div>}
        {showMessage && NotificationManager.error(alertMessage)}
        <NotificationContainer />
      </div>
    )
  }
}

export default SignIn
