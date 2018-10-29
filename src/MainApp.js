import React from 'react'
import { Route, Switch, BrowserRouter } from 'react-router-dom'
import {
  auth,
  db,
  facebookAuthProvider,
  githubAuthProvider,
  googleAuthProvider,
  twitterAuthProvider
} from './helper/firebase'
import App from './containers/App'
import { ApolloProvider } from 'react-apollo'
import client from 'helper/graphql'
import Context from 'context'
import {
  FIXED_DRAWER,
  INSIDE_THE_HEADER,
  VERTICAL_NAVIGATION
} from 'constants/ActionTypes'
import { DARK_INDIGO } from 'constants/ThemeColors'
import { NotificationManager } from 'react-notifications'

class MainApp extends React.Component {
  state = {
    auth: {
      loader: false,
      showAuthLoader: () =>
        this.setState({ auth: { ...this.state.auth, loader: true } }),
      hideAuthLoader: () =>
        this.setState({ auth: { ...this.state.auth, loader: false } }),

      initURL: '',
      setInitUrl: url =>
        this.setState({ auth: { ...this.state.auth, setInitUrl: url } }),

      token: null,
      saveTokenFCM: token =>
        this.setState({ auth: { ...this.state.auth, tokenFCM: token } }),

      authUser: null,
      userSignIn: async (email, password) => {
        try {
          const signInUser = await auth.signInWithEmailAndPassword(
            email,
            password
          )
          await db.collection('users').doc(signInUser.user.uid).update({
            status: 'online'
          })
          console.log(this.props)
        } catch (error) {
          NotificationManager.error(error.message)
        }
        this.state.auth.hideAuthLoader()
      },
      userProviderSignIn: async provider => {
        try {
          switch (provider) {
            case 'facebook': {
              provider = facebookAuthProvider
              break
            }
            case 'google': {
              provider = googleAuthProvider
              break
            }
            case 'twitter': {
              provider = twitterAuthProvider
              break
            }
            case 'github': {
              provider = githubAuthProvider
              break
            }
            default: {
              return
            }
          }
          const signInUser = await auth.signInWithPopup(provider)
          await db.collection('users').doc(signInUser.user.uid).update({
            status: 'online'
          })
        } catch (error) {
          NotificationManager.error(error.message)
        }
        this.state.auth.hideAuthLoader()
      },
      userSignUp: async (email, password, name) => {
        try {
          const signUpUser = await auth.createUserWithEmailAndPassword(
            email,
            password
          )
          await Promise.all([
            signUpUser.user.updateProfile({
              displayName: name
            }),
            db.collection('users').doc(signUpUser.user.uid).update({
              displayName: name,
              status: 'online'
            }),
            signUpUser.user.sendEmailVerification()
          ])
          this.state.auth.userSignInSuccess(signUpUser.user)
        } catch (error) {
          NotificationManager.error(error.message)
        }
        this.state.auth.hideAuthLoader()
      },
      resetPass: async email => {
        try {
          await auth.sendPasswordResetEmail(email)
          NotificationManager.success('Check your emails')
        } catch (error) {
          NotificationManager.error(error.message)
        }
        this.state.auth.hideAuthLoader()
      },
      updateAccount: async (displayName, email, photoURL) =>
        this.setState({
          auth: {
            ...this.state.auth,
            authUser: {
              ...this.state.auth.authUser,
              displayName,
              email,
              photoURL
            }
          }
        }),
      userSignOut: async () => {
        try {
          const signOutUser = auth.signOut()
          await Promise.all([
            db.collection('users').doc(auth.currentUser.uid).update({
              status: 'offline'
            }),
            signOutUser
          ])
          if (signOutUser === undefined) {
            this.state.auth.userSignOutSuccess()
          }
        } catch (error) {
          NotificationManager.error(error.message)
        }
        this.state.auth.hideAuthLoader()
      },
      userSignInSuccess: user =>
        this.setState({
          auth: {
            ...this.state.auth,
            loader: false,
            authUser: {
              email: user.email,
              displayName: user.displayName,
              phoneNumber: user.phoneNumber,
              photoURL: user.photoURL,
              emailVerified: user.emailVerified,
              status: 'online',
              uid: user.uid
            }
          }
        }),
      userSignOutSuccess: () =>
        this.setState({
          auth: {
            ...this.state.auth,
            authUser: null,
            initURL: '/app/dashboard',
            loader: false,
            status: 'offline'
          }
        })
    },
    settings: {
      navCollapsed: false,
      toggleCollapsedNav: val =>
        this.setState({
          settings: {
            ...this.state.settings,
            navCollapsed: !this.state.navCollapsed
          }
        }),

      drawerType: FIXED_DRAWER,
      setDrawerType: drawerType =>
        this.setState({
          settings: {
            ...this.state.settings,
            drawerType
          }
        }),

      themeColor: DARK_INDIGO,
      setThemeColor: themeColor =>
        this.setState({
          settings: {
            ...this.state.settings,
            themeColor
          }
        }),

      darkTheme: false,
      setDarkTheme: () =>
        this.setState({
          settings: {
            ...this.state.settings,
            darkTheme: !this.state.settings.darkTheme
          }
        }),

      width: window.innerWidth,
      updateWindowWidth: width =>
        this.setState({
          settings: {
            ...this.state.settings,
            width
          }
        }),

      isDirectionRTL: false,
      changeDirection: () =>
        this.setState({
          settings: {
            ...this.state.settings,
            isDirectionRTL: !this.state.settings.isDirectionRTL
          }
        }),

      navigationStyle: VERTICAL_NAVIGATION,
      changeNavigationStyle: navigationStyle =>
        this.setState({
          settings: {
            ...this.state.settings,
            navigationStyle
          }
        }),

      horizontalNavPosition: INSIDE_THE_HEADER,
      setHorizontalMenuPosition: position =>
        this.setState({
          settings: {
            ...this.state.settings,
            horizontalNavPosition: position
          }
        }),

      locale: {
        languageId: 'english',
        locale: 'en',
        name: 'English',
        icon: 'us'
      },
      switchLanguage: locale =>
        this.setState({ settings: { ...this.state.settings, locale } })
    }
  }

  componentDidMount = async () => {
    const store = await JSON.parse(window.localStorage.getItem('store'))

    if (store) {
      this.setState((state, props) => ({
        auth: { ...state.auth, ...store.auth },
        settings: { ...state.settings, ...store.settings }
      }))
    }
  }

  componentDidUpdate = () => {
    window.localStorage.setItem('store', JSON.stringify(this.state))
  }

  render () {
    return (
      <Context.Provider value={{ ...this.state }}>
        <BrowserRouter>
          <ApolloProvider client={client}>
            <Switch>
              <Route path='/' component={App} />
            </Switch>
          </ApolloProvider>
        </BrowserRouter>
      </Context.Provider>
    )
  }
}

export default MainApp
