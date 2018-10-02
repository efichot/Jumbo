import React from 'react';
import NotificationItem from './NotificationItem';
import CustomScrollbars from 'util/CustomScrollbars';

const MailNotification = ({ messages }) => {
  return (
    <CustomScrollbars
      className="messages-list scrollbar"
      style={{ height: 280 }}
    >
      <ul className="list-unstyled">
        {messages.map((notification, index) => (
          <NotificationItem key={index} notification={notification} />
        ))}
      </ul>
    </CustomScrollbars>
  );
};

export default MailNotification;
