import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar'
import Avatar from '@material-ui/core/Avatar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import { Dropdown, DropdownMenu, DropdownToggle } from 'reactstrap'
import {
  COLLAPSED_DRAWER,
  FIXED_DRAWER,
  HORIZONTAL_NAVIGATION,
  BELOW_THE_HEADER,
  INSIDE_THE_HEADER
} from 'constants/ActionTypes'
import SearchBox from 'components/SearchBox'
import MailNotification from '../MailNotification/index'
import AppNotification from '../AppNotification/index'
import CardHeader from 'components/CardHeader/index'
import IntlMessages from 'util/IntlMessages'
import LanguageSwitcher from 'components/LanguageSwitcher/index'
import Menu from 'components/TopNav/Menu'
import UserInfoPopup from 'components/UserInfo/UserInfoPopup'
import iota from 'assets/images/iota_light.svg'
import defaultPhoto from 'assets/images/placeholder.jpg'
import { db } from 'helper/firebase'
import Context from 'context'

class Header extends Component {
  static contextType = Context

  state = {
    anchorEl: undefined,
    searchBox: false,
    searchText: '',
    mailNotification: false,
    userInfo: false,
    langSwitcher: false,
    appNotification: false,
    messages: []
  }

  componentDidMount = () => {
    const { auth: { authUser } } = this.context
    db.collection('users').doc(authUser.uid).onSnapshot(doc => {
      if (doc.exists) {
        this.setState({ messages: Object.values(doc.data().messages) })
      }
    })
  }

  onAppNotificationSelect = () => {
    this.setState({
      appNotification: !this.state.appNotification
    })
  }
  onMailNotificationSelect = () => {
    this.setState({
      mailNotification: !this.state.mailNotification
    })
  }
  onLangSwitcherSelect = event => {
    this.setState({
      langSwitcher: !this.state.langSwitcher,
      anchorEl: event.currentTarget
    })
  }
  onSearchBoxSelect = () => {
    this.setState({
      searchBox: !this.state.searchBox
    })
  }
  onUserInfoSelect = () => {
    this.setState({
      userInfo: !this.state.userInfo
    })
  }
  handleRequestClose = () => {
    this.setState({
      langSwitcher: false,
      userInfo: false,
      mailNotification: false,
      appNotification: false,
      searchBox: false
    })
  }

  onToggleCollapsedNav = e => {
    const val = !this.context.settings.navCollapsed
    this.context.settings.toggleCollapsedNav(val)
  }

  clearMessages = () => {
    const { uid } = this.context.auth.authUser
    db.collection('users').doc(uid).update({
      messages: {}
    })
  }

  render () {
    const {
      auth: { authUser },
      settings: {
        drawerType,
        navigationStyle,
        horizontalNavPosition,
        locale,
        switchLanguage
      }
    } = this.context
    const { messages } = this.state
    const drawerStyle = drawerType === FIXED_DRAWER
      ? 'd-block d-xl-none'
      : drawerType === COLLAPSED_DRAWER ? 'd-block' : 'd-none'

    return (
      <AppBar
        className={`app-main-header ${navigationStyle === HORIZONTAL_NAVIGATION && horizontalNavPosition === BELOW_THE_HEADER ? 'app-main-header-top' : ''}`}
      >
        <Toolbar className='app-toolbar' disableGutters={false}>
          {navigationStyle === HORIZONTAL_NAVIGATION
            ? <div
              className='d-block d-md-none pointer mr-3'
              onClick={this.onToggleCollapsedNav}
              >
              <span className='jr-menu-icon'>
                <span className='menu-icon' />
              </span>
            </div>
            : <IconButton
              className={`jr-menu-icon mr-3 ${drawerStyle}`}
              aria-label='Menu'
              onClick={this.onToggleCollapsedNav}
              >
              <span className='menu-icon' />
            </IconButton>}

          <Link className='app-logo mr-2 d-none d-sm-block' to='/'>
            <img src={iota} alt='Jambo' title='Jambo' />
          </Link>

          <SearchBox styleName='d-none d-md-block' placeholder='' />
          {navigationStyle === HORIZONTAL_NAVIGATION &&
            horizontalNavPosition === INSIDE_THE_HEADER &&
            <Menu />}

          <ul className='header-notifications list-inline ml-auto'>
            <li className='d-inline-block d-md-none list-inline-item'>
              <Dropdown
                className='quick-menu nav-searchbox'
                isOpen={this.state.searchBox}
                toggle={this.onSearchBoxSelect}
              >
                <DropdownToggle
                  className='d-inline-block'
                  tag='span'
                  data-toggle='dropdown'
                >
                  <IconButton className='icon-btn'>
                    <i className='zmdi zmdi-search zmdi-hc-fw' />
                  </IconButton>
                </DropdownToggle>

                <DropdownMenu right className='p-0'>
                  <SearchBox styleName='search-dropdown' placeholder='' />
                </DropdownMenu>
              </Dropdown>
            </li>
            <li className='list-inline-item p-0'>
              <Dropdown
                className='quick-menu'
                isOpen={this.state.langSwitcher}
                toggle={this.onLangSwitcherSelect}
              >
                <DropdownToggle
                  className='d-inline-block'
                  tag='span'
                  data-toggle='dropdown'
                >
                  <IconButton className='icon-btn font-size-20'>
                    <i className={`flag flag-24 flag-${locale.icon}`} />
                  </IconButton>
                </DropdownToggle>

                <DropdownMenu right className='w-50'>
                  <LanguageSwitcher
                    switchLanguage={switchLanguage}
                    handleRequestClose={this.handleRequestClose}
                  />
                </DropdownMenu>
              </Dropdown>
            </li>
            <li className='list-inline-item app-tour p-0'>
              <Dropdown
                className='quick-menu'
                isOpen={this.state.appNotification}
                toggle={this.onAppNotificationSelect}
              >
                <DropdownToggle
                  className='d-inline-block'
                  tag='span'
                  data-toggle='dropdown'
                >
                  <IconButton className='icon-btn font-size-20'>
                    <i className='zmdi zmdi-notifications-active icon-alert animated swing' />
                  </IconButton>
                </DropdownToggle>

                <DropdownMenu right>
                  <CardHeader
                    styleName='align-items-center'
                    heading={<IntlMessages id='appNotification.title' />}
                  />
                  <AppNotification />
                </DropdownMenu>
              </Dropdown>
            </li>
            <li className='list-inline-item mail-tour p-0'>
              <Dropdown
                className='quick-menu'
                isOpen={this.state.mailNotification}
                toggle={this.onMailNotificationSelect}
              >
                <DropdownToggle
                  className='d-inline-block'
                  tag='span'
                  data-toggle='dropdown'
                >
                  <IconButton className='icon-btn font-size-20'>
                    <i
                      className={`zmdi zmdi-comment-alt-text zmdi-hc-fw animated ${messages.length ? 'icon-alert swing' : ''}`}
                    />
                  </IconButton>
                </DropdownToggle>

                <DropdownMenu right>
                  <CardHeader
                    styleName='align-items-center'
                    heading={<IntlMessages id='mailNotification.title' />}
                    clearData={this.clearMessages}
                  />
                  <MailNotification messages={messages} />
                </DropdownMenu>
              </Dropdown>
            </li>

            {navigationStyle === HORIZONTAL_NAVIGATION &&
              <li className='list-inline-item user-nav'>
                <Dropdown
                  className='quick-menu'
                  isOpen={this.state.userInfo}
                  toggle={this.onUserInfoSelect}
                >
                  <DropdownToggle
                    className='d-inline-block'
                    tag='span'
                    data-toggle='dropdown'
                  >
                    <Avatar
                      alt='...'
                      src={authUser.photoURL || defaultPhoto}
                      className='size-30 pointer'
                    />
                  </DropdownToggle>

                  <DropdownMenu right>
                    <UserInfoPopup />
                  </DropdownMenu>
                </Dropdown>
              </li>}
          </ul>
        </Toolbar>
      </AppBar>
    )
  }
}

export default withRouter(Header)
