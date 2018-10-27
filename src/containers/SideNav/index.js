import React from 'react'
import { withRouter } from 'react-router-dom'
import Drawer from '@material-ui/core/Drawer'
import SidenavContent from './SidenavContent'
import UserInfo from 'components/UserInfo'
import IconButton from '@material-ui/core/IconButton'
import {
  COLLAPSED_DRAWER,
  FIXED_DRAWER,
  HORIZONTAL_NAVIGATION
} from 'constants/ActionTypes'
import Context from 'context'

class SideNav extends React.PureComponent {
  static contextType = Context

  onToggleCollapsedNav = e => {
    const { settings: { navCollapsed, toggleCollapsedNav } } = this.context
    const val = !navCollapsed
    toggleCollapsedNav(val)
  }

  setDrawerType = drawerType => e => {
    const { settings: { setDrawerType } } = this.context
    if (drawerType === 'mini_drawer') setDrawerType('fixed_drawer')
    else setDrawerType('mini_drawer')
  }

  componentDidMount () {
    window.addEventListener('resize', () => {
      this.context.settings.updateWindowWidth(window.innerWidth)
    })
  }

  render () {
    const {
      settings: {
        navCollapsed,
        drawerType,
        width,
        navigationStyle,
        themeColor
      }
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
          className='app-sidebar-content'
          variant={type}
          open={type === 'temporary' ? navCollapsed : true}
          onClose={this.onToggleCollapsedNav}
          classes={{
            paper: 'side-nav'
          }}
        >
          <UserInfo />
          <SidenavContent drawerType={drawerType} />
          <div
            style={{ backgroundColor: color }}
            className='d-flex pointer'
            onClick={this.setDrawerType(drawerType)}
          >
            <IconButton className='ml-auto mr-4 mb-2 mt-1'>
              {drawerType === 'mini_drawer'
                ? <i className='zmdi zmdi-chevron-right text-grey' />
                : <i className='zmdi zmdi-chevron-left text-grey' />}
            </IconButton>
          </div>
        </Drawer>
      </div>
    )
  }
}

export default withRouter(SideNav)
