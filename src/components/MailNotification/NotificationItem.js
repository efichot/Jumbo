import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import moment from 'moment';

const NotificationItem = ({ notification }) => {
  const { photoURL, displayName, time, message, unreadMessage } = notification;
  return (
    <li className="media">
      <div className="user-avatar">
        <Avatar alt="" src={photoURL} />
        <span className="badge badge-danger rounded-circle">
          {unreadMessage}
        </span>
      </div>
      <div className="media-body">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="text-capitalize user-name mb-0">
            <a href="javascript:void(0)">{displayName}</a>
          </h5>
          <span className="meta-date">
            <small>{moment.unix(time.seconds).fromNow()}</small>
          </span>
        </div>
        <p className="sub-heading">{message}</p>
        <Button className="jr-btn jr-btn-xs text-muted">
          <i className="zmdi zmdi-mail-reply" />
          <span>Reply</span>
        </Button>
        <Button className="jr-btn jr-btn-xs text-muted">
          <i className="zmdi zmdi-eye" />
          <span>Read</span>
        </Button>
      </div>
    </li>
  );
};

export default NotificationItem;
