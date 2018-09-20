import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { userSignOut } from 'actions/Auth';
import IntlMessages from 'util/IntlMessages';
import defaultPhoto from 'assets/images/placeholder.jpg';

class UserInfoPopup extends React.Component {
  render() {
    const { authUser } = this.props;
    return (
      <div>
        <div className="user-profile">
          <img
            className="user-avatar border-0 size-40 rounded-circle"
            src={authUser.photoURL || defaultPhoto}
            alt="User"
          />
          <div className="user-detail ml-2">
            <h4 className="user-name mb-0">{authUser.displayName}</h4>
            <small>Administrator</small>
          </div>
        </div>
        <Link className="dropdown-item text-muted" to="/app/profile">
          <i className="zmdi zmdi-face zmdi-hc-fw mr-1" />
          <IntlMessages id="popup.profile" />
        </Link>
        <Link className="dropdown-item text-muted" to="/app/settings">
          <i className="zmdi zmdi-settings zmdi-hc-fw mr-1" />
          <IntlMessages id="popup.setting" />
        </Link>
        <a
          className="dropdown-item text-muted"
          href="javascript:void(0)"
          onClick={() => {
            console.log('Try to logoput');
            this.props.userSignOut();
          }}
        >
          <i className="zmdi zmdi-sign-in zmdi-hc-fw mr-1" />
          <IntlMessages id="popup.logout" />
        </a>
      </div>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  const { authUser } = auth;
  return { authUser };
};

export default connect(
  mapStateToProps,
  { userSignOut }
)(UserInfoPopup);
