import React from 'react'
import moment from 'moment'

const ReceivedMessageCell = ({ conversation, user }) => {
  return (
    <div className='d-flex flex-nowrap chat-item'>
      <img
        className='rounded-circle avatar size-40 align-self-end'
        src={user.photoURL}
        alt=''
      />

      <div className='bubble'>
        <div className='message'>{conversation.message}</div>
        <div className='time text-muted text-right mt-2'>
          {moment.unix(conversation.sentAt.seconds).format('hh:mm:ss A')}
        </div>
      </div>
    </div>
  )
}

export default ReceivedMessageCell
