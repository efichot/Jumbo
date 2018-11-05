import React, { Component, Suspense } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MomentUtils from 'material-ui-pickers/utils/moment-utils'
import { MuiPickersUtilsProvider } from 'material-ui-pickers'
import { Redirect, Route, Switch } from 'react-router-dom'
import { IntlProvider } from 'react-intl'
import 'react-notifications/lib/notifications.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'owl.carousel/dist/assets/owl.carousel.css'
import 'owl.carousel/dist/assets/owl.theme.default.css'
import 'styles/jumbo.css'
import indigoTheme from './themes/indigoTheme'
import cyanTheme from './themes/cyanTheme'
import orangeTheme from './themes/orangeTheme'
import amberTheme from './themes/amberTheme'
import pinkTheme from './themes/pinkTheme'
import blueTheme from './themes/blueTheme'
import purpleTheme from './themes/purpleTheme'
import greenTheme from './themes/greenTheme'
import darkTheme from './themes/darkTheme'
import AppLocale from '../lngProvider'
import {
  AMBER,
  BLUE,
  CYAN,
  DARK_AMBER,
  DARK_BLUE,
  DARK_CYAN,
  DARK_DEEP_ORANGE,
  DARK_DEEP_PURPLE,
  DARK_GREEN,
  DARK_INDIGO,
  DARK_PINK,
  DEEP_ORANGE,
  DEEP_PURPLE,
  GREEN,
  INDIGO,
  PINK
} from 'constants/ThemeColors'

import MainApp from 'app/index'
import SignIn from './SignIn'
import SignUp from './SignUp'
import ResetPass from './ResetPass'
import RTL from 'util/RTL'
import { NotificationContainer } from 'react-notifications'
import { auth, messaging } from 'helper/firebase'
import LinearProgress from '@material-ui/core/LinearProgress'
import Context from 'context'

window.$ = window.jQuery = require('jquery')
window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true

const NotFound = React.lazy(() => import('app/routes/extraPages/routes/404'))

const RestrictedRoute = ({ component: Component, authUser, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      (authUser
        ? <Component {...props} />
        : <Redirect
          to={{
            pathname: '/signin',
            state: { from: props.location }
          }}
          />)}
  />
)
class App extends Component {
  static contextType = Context

  componentDidMount () {
    const {
      auth: {
        initURL,
        setInitUrl,
        userSignInSuccess,
        saveTokenFCM,
        userSignOutSuccess
      }
    } = this.context
    const { history } = this.props

    if (initURL === '') {
      setInitUrl(history.location.pathname)
    }
    auth.onAuthStateChanged(user => {
      if (user) {
        console.log('User sign in')
        userSignInSuccess(user)
        messaging
          .getToken()
          .then(token => {
            saveTokenFCM(token)
          })
          .catch(e => console.log('Impossible to get tokenFCM'))
      } else {
        console.log('User not sign in')
        userSignOutSuccess()
      }
    })
  }

  getColorTheme (themeColor, applyTheme) {
    switch (themeColor) {
      case INDIGO: {
        applyTheme = createMuiTheme(indigoTheme)
        break
      }
      case CYAN: {
        applyTheme = createMuiTheme(cyanTheme)
        break
      }
      case AMBER: {
        applyTheme = createMuiTheme(amberTheme)
        break
      }
      case DEEP_ORANGE: {
        applyTheme = createMuiTheme(orangeTheme)
        break
      }
      case PINK: {
        applyTheme = createMuiTheme(pinkTheme)
        break
      }
      case BLUE: {
        applyTheme = createMuiTheme(blueTheme)
        break
      }
      case DEEP_PURPLE: {
        applyTheme = createMuiTheme(purpleTheme)
        break
      }
      case GREEN: {
        applyTheme = createMuiTheme(greenTheme)
        break
      }
      case DARK_INDIGO: {
        applyTheme = createMuiTheme(indigoTheme)
        break
      }
      case DARK_CYAN: {
        applyTheme = createMuiTheme(cyanTheme)
        break
      }
      case DARK_AMBER: {
        applyTheme = createMuiTheme(amberTheme)
        break
      }
      case DARK_DEEP_ORANGE: {
        applyTheme = createMuiTheme(orangeTheme)
        break
      }
      case DARK_PINK: {
        applyTheme = createMuiTheme(pinkTheme)
        break
      }
      case DARK_BLUE: {
        applyTheme = createMuiTheme(blueTheme)
        break
      }
      case DARK_DEEP_PURPLE: {
        applyTheme = createMuiTheme(purpleTheme)
        break
      }
      case DARK_GREEN: {
        applyTheme = createMuiTheme(greenTheme)
        break
      }
      default: {
      }
    }
    return applyTheme
  }

  render () {
    const {
      auth: { authUser, initURL },
      settings: { locale, isDarkTheme, isDirectionRTL, themeColor }
    } = this.context
    const { match, location } = this.props

    let applyTheme = createMuiTheme(indigoTheme)
    if (isDarkTheme) {
      document.body.classList.add('dark-theme')
      applyTheme = createMuiTheme(darkTheme)
    } else {
      applyTheme = this.getColorTheme(themeColor, applyTheme)
    }
    if (location.pathname === '/') {
      if (authUser === null) {
        return <Redirect to={'/signin'} />
      } else if (initURL === '' || initURL === '/' || initURL === '/signin') {
        return <Redirect to={'/app/dashboard'} />
      } else {
        return <Redirect to={initURL} />
      }
    }
    if (isDirectionRTL) {
      applyTheme.direction = 'rtl'
      document.body.classList.add('rtl')
    } else {
      document.body.classList.remove('rtl')
      applyTheme.direction = 'ltr'
    }

    const currentAppLocale = AppLocale[locale.locale]
    return (
      <MuiThemeProvider theme={applyTheme}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <IntlProvider
            locale={currentAppLocale.locale}
            messages={currentAppLocale.messages}
          >
            <RTL>
              <div className='app-main'>
                <Switch>
                  <RestrictedRoute
                    path={`${match.url}app`}
                    authUser={authUser}
                    component={MainApp}
                  />
                  <Route path='/signin' component={SignIn} />
                  <Route path='/signup' component={SignUp} />
                  <Route path='/resetpass' component={ResetPass} />
                  <Route
                    render={() => (
                      <Suspense fallback={<LinearProgress color='secondary' />}>
                        <NotFound />
                      </Suspense>
                    )}
                  />
                </Switch>
                <NotificationContainer />
              </div>
            </RTL>
          </IntlProvider>
        </MuiPickersUtilsProvider>
      </MuiThemeProvider>
    )
  }
}

export default App
