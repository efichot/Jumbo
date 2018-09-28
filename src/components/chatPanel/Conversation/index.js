import React from 'react';
import ReceivedMessageCell from './ReceivedMessageCell/index';
import SentMessageCell from './SentMessageCell/index';

const Conversation = ({ conversationData, userSelected, user }) => {
  return (
    <div className="chat-main-content">
      {conversationData.map(
        (conversation, index) =>
          conversation.sender === user.uid ? (
            <SentMessageCell
              key={index}
              conversation={conversation}
              user={user}
            />
          ) : (
            <ReceivedMessageCell
              key={index}
              conversation={conversation}
              user={userSelected}
            />
          )
      )}
    </div>
  );
};

export default Conversation;
