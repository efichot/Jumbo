import React from 'react'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import { Link } from 'react-router-dom'
import IntlMessages from 'util/IntlMessages'
import iota from 'assets/images/iota_light.svg'
import Context from 'context'

class SignUp extends React.Component {
  static contextType = Context

  state = {
    name: '',
    email: '',
    password: ''
  }

  componentDidUpdate = () => {
    const { auth: { authUser } } = this.context
    const { history } = this.props

    if (authUser !== null) {
      history.push('/')
    }
  }

  render () {
    const {
      auth: { showAuthLoader, userSignUp, loader, userProviderSignIn }
    } = this.context
    const { name, email, password } = this.state
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
            <div className='app-login-header'>
              <h1>Sign Up</h1>
            </div>

            <div className='mb-4'>
              <h2>
                <IntlMessages id='appModule.createAccount' />
              </h2>
            </div>

            <div className='app-login-form'>
              <form method='post' action='/'>
                <TextField
                  type='text'
                  label='Name'
                  onChange={event =>
                    this.setState({ name: event.target.value })}
                  fullWidth
                  defaultValue={name}
                  margin='normal'
                  className='mt-0 mb-2'
                />

                <TextField
                  type='email'
                  onChange={event =>
                    this.setState({ email: event.target.value })}
                  label={<IntlMessages id='appModule.email' />}
                  fullWidth
                  defaultValue={email}
                  margin='normal'
                  className='mt-0 mb-2'
                />

                <TextField
                  type='password'
                  onChange={event =>
                    this.setState({ password: event.target.value })}
                  label={<IntlMessages id='appModule.password' />}
                  fullWidth
                  defaultValue={password}
                  margin='normal'
                  className='mt-0 mb-4'
                />

                <div className='mb-3 d-flex align-items-center justify-content-between'>
                  <Button
                    variant='contained'
                    onClick={() => {
                      showAuthLoader()
                      userSignUp(email, password, name)
                    }}
                    color='primary'
                  >
                    <IntlMessages id='appModule.regsiter' />
                  </Button>
                  <Link to='/signin'>
                    <IntlMessages id='signUp.alreadyMember' />
                  </Link>
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
              </form>
            </div>
          </div>
        </div>

        {loader &&
          <div className='loader-view'>
            <CircularProgress />
          </div>}
      </div>
    )
  }
}

export default SignUp
