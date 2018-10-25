import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import { connect } from 'react-redux'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { userSignOut } from 'actions/Auth'
import IntlMessages from 'util/IntlMessages'
import defaultPhoto from 'assets/images/placeholder.jpg'
import { withRouter } from 'react-router-dom'

class UserInfo extends React.Component {
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
    const { authUser, history } = this.props
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
              this.props.userSignOut()
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

const mapStateToProps = ({ settings, auth }) => {
  const { locale } = settings
  const { authUser } = auth
  return { locale, authUser }
}
export default withRouter(connect(mapStateToProps, { userSignOut })(UserInfo))
