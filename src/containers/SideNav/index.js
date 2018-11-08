import React from 'react'
import { withRouter } from 'react-router-dom'
import Drawer from '@material-ui/core/Drawer'
import SidenavContent from './SidenavContent'
import UserInfo from 'components/UserInfo'
import IconButton from '@material-ui/core/IconButton'
import {
  COLLAPSED_DRAWER,
  FIXED_DRAWER,
  HORIZONTAL_NAVIGATION,
} from 'constants/ActionTypes'
import Context from 'context'
import { Transition, config } from 'react-spring'

class SideNav extends React.PureComponent {
  static contextType = Context

  setDrawerType = drawerType => e => {
    const { settings: { setDrawerType } } = this.context
    if (drawerType === 'mini_drawer') setDrawerType('fixed_drawer')
    else setDrawerType('mini_drawer')
  }

  componentDidMount() {
    window.addEventListener('resize', () => {
      this.context.settings.updateWindowWidth(window.innerWidth)
    })
  }

  render() {
    const {
      settings: {
        navCollapsed,
        drawerType,
        width,
        navigationStyle,
        themeColor,
        toggleCollapsedNav
      },
    } = this.context
    let drawerStyle = drawerType === FIXED_DRAWER
      ? 'd-xl-flex'
      : drawerType === COLLAPSED_DRAWER ? '' : 'd-flex'
    let type = 'permanent'
    if (
      drawerType === COLLAPSED_DRAWER ||
      (drawerType === FIXED_DRAWER && width < 1200)
    ) {
      type = 'temporary'
    }

    if (navigationStyle === HORIZONTAL_NAVIGATION) {
      drawerStyle = ''
      type = 'temporary'
    }
    const color = themeColor.startsWith('dark') ? '#161616' : 'white'

    return (
      <div className={`app-sidebar d-none ${drawerStyle}`}>
        <Drawer
          className="app-sidebar-content"
          variant={type}
          open={type === 'temporary' ? navCollapsed : true}
          onClose={toggleCollapsedNav}
          classes={{
            paper: 'side-nav',
          }}
        >
          <UserInfo/>
          <SidenavContent drawerType={drawerType} />
          <div
            style={{ backgroundColor: color }}
            className="d-flex pointer"
            onClick={this.setDrawerType(drawerType)}
          >
            <IconButton className="ml-auto p-2 mr-4 mb-4 mt-3">
              <Transition
                config={config.slow}
                items={drawerType === 'mini_drawer'}
                from={{ position: 'absolute', opacity: 0, transform: 'rotate(180deg)' }}
                enter={{ opacity: 1, transform: 'rotate(0deg)' }}
                leave={{ opacity: 0 }}
              >
                {toggle =>
                  (toggle
                    ? props => <i style={props} className="zmdi zmdi-chevron-right text-grey"/>
                    : props => <i style={props} className="zmdi zmdi-chevron-left text-grey" />
                  )}
              </Transition>
            </IconButton>
          </div>
        </Drawer>
      </div>
    )
  }
}

export default withRouter(SideNav)
