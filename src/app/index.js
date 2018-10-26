import React, { Suspense } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Header from 'components/Header/index'
import Sidebar from 'containers/SideNav/index'
import Footer from 'components/Footer'
import Tour from '../components/Tour/index'
import {
  ABOVE_THE_HEADER,
  BELOW_THE_HEADER,
  COLLAPSED_DRAWER,
  FIXED_DRAWER,
  HORIZONTAL_NAVIGATION
} from 'constants/ActionTypes'
import ColorOption from 'containers/Customizer/ColorOption'
import { isIOS, isMobile } from 'react-device-detect'
import TopNav from 'components/TopNav'
import Dashboard from './routes/dashboard'
import Settings from './routes/settings'
import Profile from './routes/profile'
import { InstantSearch } from 'react-instantsearch-dom'
import LinearProgress from '@material-ui/core/LinearProgress'
import authContext from 'context/auth.js'

const Chat = React.lazy(() => import('./routes/chat'))
const ToDo = React.lazy(() => import('./routes/todo'))
const NotFound = React.lazy(() => import('./routes/extraPages/routes/404'))
class App extends React.Component {
  state = {
    isAuth: false,
    toggleAuth: () => {}
  }

  toggleAuth = () => this.setState({ isAuth: !this.state.isAuth })

  render () {
    const {
      match,
      drawerType,
      navigationStyle,
      horizontalNavPosition
    } = this.props
    const drawerStyle = drawerType.includes(FIXED_DRAWER)
      ? 'fixed-drawer'
      : drawerType.includes(COLLAPSED_DRAWER)
          ? 'collapsible-drawer'
          : 'mini-drawer'

    // set default height and overflow for iOS mobile Safari 10+ support.
    if (isIOS && isMobile) {
      document.body.classList.add('ios-mobile-view-height')
    } else if (document.body.classList.contains('ios-mobile-view-height')) {
      document.body.classList.remove('ios-mobile-view-height')
    }

    return (
      <InstantSearch
        appId={process.env.REACT_APP_ALGOLIA_APP_ID}
        apiKey={process.env.REACT_APP_ALGOLIA_API_KEY}
        indexName={process.env.REACT_APP_ALGOLIA_INDICE}
      >
        <authContext.Provider
          value={{ isAuth: false, toggleAuth: this.toggleAuth }}
        >
          <div className={`app-container ${drawerStyle}`}>
            <Tour />

            <Sidebar />
            <div className='app-main-container'>
              <div
                className={`app-header ${navigationStyle === HORIZONTAL_NAVIGATION ? 'app-header-horizontal' : ''}`}
              >
                {navigationStyle === HORIZONTAL_NAVIGATION &&
                  horizontalNavPosition === ABOVE_THE_HEADER &&
                  <TopNav styleName='app-top-header' />}
                <Header />
                {navigationStyle === HORIZONTAL_NAVIGATION &&
                  horizontalNavPosition === BELOW_THE_HEADER &&
                  <TopNav />}
              </div>

              <main className='app-main-content-wrapper'>
                <div className='app-main-content'>
                  <Switch>
                    <Route
                      exact
                      path={`${match.url}/dashboard`}
                      component={Dashboard}
                    />
                    <Route
                      exact
                      path={`${match.url}/settings`}
                      component={Settings}
                    />
                    <Route
                      exact
                      path={`${match.url}/profile`}
                      component={Profile}
                    />
                    <Route
                      exact
                      path={`${match.url}/chat`}
                      render={() => (
                        <Suspense
                          fallback={<LinearProgress color='secondary' />}
                        >
                          <Chat />
                        </Suspense>
                      )}
                    />
                    <Route
                      exact
                      path={`${match.url}/todo`}
                      render={() => (
                        <Suspense
                          fallback={<LinearProgress color='secondary' />}
                        >
                          <ToDo />
                        </Suspense>
                      )}
                    />
                    <Route
                      render={() => (
                        <Suspense
                          fallback={<LinearProgress color='secondary' />}
                        >
                          <NotFound />
                        </Suspense>
                      )}
                    />
                  </Switch>
                </div>
                <Footer />
              </main>
            </div>
            <ColorOption />
          </div>
        </authContext.Provider>
      </InstantSearch>
    )
  }
}

const mapStateToProps = ({ settings, auth }) => {
  const { authUser } = auth
  const { drawerType, navigationStyle, horizontalNavPosition } = settings
  return { drawerType, navigationStyle, horizontalNavPosition, authUser }
}
export default withRouter(connect(mapStateToProps)(App))
