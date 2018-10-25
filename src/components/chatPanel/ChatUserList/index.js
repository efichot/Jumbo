import React from 'react'
import UserCell from './UserCell/index'

const ChatUserList = ({ chatUsers, selectedSectionId, onSelectUser, uid }) => {
  return (
    <div className='chat-user'>
      {chatUsers.map((chat, index) => (
        <UserCell
          key={index}
          chat={chat}
          selectedSectionId={selectedSectionId}
          onSelectUser={onSelectUser}
          uid={uid}
        />
      ))}
    </div>
  )
}

export default ChatUserList
