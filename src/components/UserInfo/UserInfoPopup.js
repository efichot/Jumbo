import React from 'react'
import { Link } from 'react-router-dom'
import IntlMessages from 'util/IntlMessages'
import defaultPhoto from 'assets/images/placeholder.jpg'
import Context from 'context'

class UserInfoPopup extends React.Component {
  static contextType = Context

  render () {
    const { auth: { authUser, userSignOut } } = this.context
    return (
      <div>
        <div className='user-profile'>
          <img
            className='user-avatar border-0 size-40 rounded-circle'
            src={authUser.photoURL || defaultPhoto}
            alt='User'
          />
          <div className='user-detail ml-2'>
            <h4 className='user-name mb-0'>{authUser.displayName}</h4>
            <small>Administrator</small>
          </div>
        </div>
        <Link className='dropdown-item text-muted' to='/app/profile'>
          <i className='zmdi zmdi-face zmdi-hc-fw mr-1' />
          <IntlMessages id='popup.profile' />
        </Link>
        <Link className='dropdown-item text-muted' to='/app/settings'>
          <i className='zmdi zmdi-settings zmdi-hc-fw mr-1' />
          <IntlMessages id='popup.setting' />
        </Link>
        <a
          className='dropdown-item text-muted'
          href='javascript:void(0)'
          onClick={() => {
            console.log('Try to logoput')
            userSignOut()
          }}
        >
          <i className='zmdi zmdi-sign-in zmdi-hc-fw mr-1' />
          <IntlMessages id='popup.logout' />
        </a>
      </div>
    )
  }
}

export default UserInfoPopup
