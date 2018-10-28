import React from 'react'
import { Link } from 'react-router-dom'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import IntlMessages from 'util/IntlMessages'
import CircularProgress from '@material-ui/core/CircularProgress'
import iota from 'assets/images/iota_light.svg'
import Context from 'context'

class ResetPass extends React.Component {
  static contextType = Context

  state = {
    email: ''
  }

  componentDidMount = () => {
    const { auth: { authUser } } = this.context
    const { history } = this.props

    if (authUser !== null) {
      history.push('/')
    }
  }

  render () {
    const { email } = this.state
    const { auth: { loader, showAuthLoader, resetPass } } = this.context
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

                  <div className='mb-3 d-flex align-items-center justify-content-between'>
                    <Button
                      onClick={() => {
                        showAuthLoader()
                        resetPass(email)
                      }}
                      variant='contained'
                      color='primary'
                    >
                      <IntlMessages id='appModule.resetPass' />
                    </Button>

                    <Link to='/signin'>
                      <IntlMessages id='appModule.returnSignInPage' />
                    </Link>
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
      </div>
    )
  }
}

export default ResetPass
