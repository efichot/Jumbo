import React from 'react'
import moment from 'moment'

const UserCell = ({ chat, selectedSectionId, onSelectUser, uid }) => {
  return (
    <div
      className={`chat-user-item ${selectedSectionId === chat.index ? 'active' : ''}`}
      onClick={() => {
        onSelectUser(chat.user)
      }}
    >
      <div className='chat-user-row row'>
        <div className='chat-avatar col-xl-2 col-3'>
          <div className='chat-avatar-mode'>
            <img
              src={chat.user.photoURL}
              className='rounded-circle size-40'
              alt=''
            />
            <span className={`chat-mode small ${chat.user.status}`} />
          </div>
        </div>

        <div className='chat-info col-xl-8 col-6'>
          <span className='name h4'>{chat.user.displayName}</span>
          <div className='chat-info-des'>
            {chat.lastMessage.message.substring(0, 25) + '...'}
          </div>
          <div className='last-message-time'>
            {moment.unix(chat.lastMessage.sentAt.seconds).fromNow()}
          </div>
        </div>

        <div className='chat-date col-xl-2 col-3'>
          <div className='bg-primary rounded-circle badge text-white'>
            {!chat.unreadMessage[uid] ? '' : chat.unreadMessage[uid]}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserCell
