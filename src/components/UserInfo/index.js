import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import IntlMessages from 'util/IntlMessages'
import defaultPhoto from 'assets/images/placeholder.jpg'
import { withRouter } from 'react-router-dom'
import Context from 'context'

class UserInfo extends React.Component {
  static contextType = Context

  state = {
    anchorEl: null,
    open: false
  }

  handleClick = event => {
    this.setState({ open: true, anchorEl: event.currentTarget })
  }

  handleRequestClose = () => {
    this.setState({ open: false })
  }

  render () {
    const { history } = this.props
    const { auth: { authUser, userSignOut } } = this.context

    return (
      <div className='user-profile d-flex flex-row align-items-center'>
        <Avatar
          alt='...'
          src={authUser.photoURL || defaultPhoto}
          className='user-avatar pointer'
          onClick={this.handleClick}
        />
        <div className='user-detail'>
          <h4 className='user-name' onClick={this.handleClick}>
            {authUser.displayName}{' '}
            <i className='zmdi zmdi-chevron-down zmdi-hc-lg ml-2' />
          </h4>
        </div>
        <Menu
          className='user-info'
          id='simple-menu'
          anchorEl={this.state.anchorEl}
          open={this.state.open}
          onClose={this.handleRequestClose}
          PaperProps={{
            style: {
              width: 120,
              paddingTop: 0,
              paddingBottom: 0
            }
          }}
        >
          <MenuItem
            onClick={() => {
              this.handleRequestClose()
              history.push('/app/profile')
            }}
          >
            <i className='zmdi zmdi-account zmdi-hc-fw mr-2' />
            <IntlMessages id='popup.profile' />
          </MenuItem>
          <MenuItem
            onClick={() => {
              this.handleRequestClose()
              history.push('/app/settings')
            }}
          >
            <i className='zmdi zmdi-settings zmdi-hc-fw mr-2' />
            <IntlMessages id='popup.setting' />
          </MenuItem>
          <MenuItem
            onClick={() => {
              this.handleRequestClose()
              userSignOut()
            }}
          >
            <i className='zmdi zmdi-sign-in zmdi-hc-fw mr-2' />

            <IntlMessages id='popup.logout' />
          </MenuItem>
        </Menu>
      </div>
    )
  }
}

export default withRouter(UserInfo)
