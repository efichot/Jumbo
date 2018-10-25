import React, { Component } from 'react'
import { connect } from 'react-redux'
import Drawer from '@material-ui/core/Drawer'
import SearchBox from 'components/SearchBox/index'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import IntlMessages from 'util/IntlMessages'
import SwipeableViews from 'react-swipeable-views'
import CustomScrollbars from 'util/CustomScrollbars'
import ContactList from 'components/chatPanel/ContactList/index'
import ChatUserList from 'components/chatPanel/ChatUserList'
import Conversation from 'components/chatPanel/Conversation/index'
import CircularProgress from '@material-ui/core/CircularProgress'
import IconButton from '@material-ui/core/IconButton'
import Input from '@material-ui/core/Input'
import { db, firebase } from 'helper/firebase'
import { NotificationManager } from 'react-notifications'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'
import Avatar from '@material-ui/core/Avatar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Select from '@material-ui/core/Select'
import Dialog from '@material-ui/core/Dialog'
import Default from 'assets/images/placeholder.jpg'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import _ from 'lodash'

export class Chat extends Component {
  state = {
    drawerState: false,
    userState: 1,
    search: '',
    selectedTabIndex: 0,
    selectedSectionId: '',
    chatList: [],
    contactList: [],
    contactListSearch: [],
    chatListSearch: [],
    contacts: [],
    mood: '',
    loader: false,
    allContacts: [],
    dialogAddContact: false,
    userSelected: null,
    message: '',
    chats: [],
    currentChat: [],
    idChat: '',
    status: ''
  }

  componentDidMount = () => {
    const { uid } = this.props.authUser

    db.collection('users').doc(uid).onSnapshot(doc => {
      this.setState({
        contacts: doc.data().contacts,
        mood: doc.data().mood,
        chats: doc.data().chats,
        status: doc.data().status
      })
    })

    db.collection('users').onSnapshot(docs => {
      let allContacts = []
      let i = 0
      docs.forEach(doc => {
        allContacts = [
          ...allContacts,
          {
            displayName: doc.data().displayName,
            email: doc.data().email,
            photoURL: doc.data().photoURL,
            mood: doc.data().mood,
            status: doc.data().status,
            uid: doc.id
          }
        ]
      })
      const contactList = allContacts
        .filter(contact => this.state.contacts.indexOf(contact.uid) !== -1)
        .map(contact => ({
          ...contact,
          index: i++
        }))
      this.setState({
        allContacts: allContacts.filter(
          contact =>
            contact.uid !== uid &&
            this.state.contacts.indexOf(contact.uid) === -1
        ),
        contactList,
        contactListSearch: contactList
      })

      let arrKeys = Object.keys(this.state.chats)
      let chatList = []
      Object.values(this.state.chats).forEach((v, i) => {
        db.collection('chats').doc(v).onSnapshot(doc => {
          chatList = [
            ...chatList,
            {
              unreadMessage: doc.data().unreadMessage,
              lastMessage: doc.data().messages[doc.data().messages.length - 1],
              user: allContacts.filter(contact => contact.uid === arrKeys[i])[
                0
              ],
              index: i
            }
          ]
          let arr = []
          const chatLists = chatList
            .reverse()
            .filter(chat => {
              if (
                chat.user &&
                chat.user.uid &&
                arr.indexOf(chat.user.uid) === -1
              ) {
                arr.push(chat.user.uid)
                return true
              }
              return false
            })
            .reverse()
          this.setState({
            chatList: chatLists,
            chatListSearch: chatLists
          })
        })
      })
    })
  }

  updateSearchChatUser = evt => {
    this.setState({
      search: evt.target.value,
      contactListSearch: this.state.contactList.filter(contact => {
        const rgx = new RegExp(evt.target.value.toLowerCase())
        return rgx.test(contact.displayName.toLowerCase())
      }),
      chatListSearch: this.state.chatList.filter(chat => {
        const rgx = new RegExp(evt.target.value.toLowerCase())
        return rgx.test(chat.user.displayName.toLowerCase())
      })
    })
  }

  handleChange = (event, value) => {
    this.setState({ selectedTabIndex: value })
  }

  handleChangeIndex = index => {
    this.setState({ selectedTabIndex: index })
  }

  toggleDialogAddContact = () => {
    this.setState({ dialogAddContact: !this.state.dialogAddContact })
  }

  addContact = contactUid => e => {
    const { uid } = this.props.authUser
    db
      .collection('users')
      .doc(uid)
      .update({
        contacts: firebase.firestore.FieldValue.arrayUnion(contactUid)
      })
      .then(() => NotificationManager.success('Contact added'))
      .catch(e => NotificationManager.error(e.message))
    this.toggleDialogAddContact()
  }

  onSelectUser = user => {
    const idChat = this.state.chats[user.uid]
    const { uid } = this.props.authUser

    this.setState({
      loader: true,
      selectedSectionId: user.index,
      userSelected: user
    })
    if (idChat) {
      const docRef = db.collection('chats').doc(idChat)

      db.runTransaction(transaction => {
        return transaction.get(docRef).then(doc => {
          transaction.update(docRef, {
            unreadMessage: {
              [uid]: 0,
              [user.uid]: doc.data().unreadMessage[user.uid]
            }
          })
        })
      })
      const docRefUser = db.collection('users').doc(uid)
      docRefUser.get().then(doc => {
        if (!_.isEmpty(doc.data().messages)) {
          docRefUser.update({
            [`messages.${user.uid}.unreadMessage`]: 0
          })
        }
      })
      db.collection('chats').doc(idChat).onSnapshot(doc => {
        this.setState({
          currentChat: doc.data().messages,
          loader: false,
          idChat
        })
      })
    } else {
      this.setState({ loader: false, currentChat: [] })
    }
  }

  ChatUsers = () => {
    const { displayName, photoURL, email } = this.props.authUser
    const { allContacts, dialogAddContact, status } = this.state
    return (
      <div className='chat-sidenav-main'>
        <div className='chat-sidenav-header'>
          <div className='chat-user-hd'>
            <div
              className='chat-avatar mr-3'
              onClick={() => {
                this.setState({
                  userState: 2
                })
              }}
            >
              <div className='chat-avatar-mode'>
                <img
                  id='user-avatar-button'
                  src={photoURL || Default}
                  className='rounded-circle size-50'
                  alt=''
                />
                <span className={`chat-mode ${status}`} />
              </div>
            </div>

            <div className='module-user-info d-flex flex-column justify-content-center'>
              <div className='module-title'>
                <h5 className='mb-0'>{displayName}</h5>
              </div>
              <div className='module-user-detail'>
                <a href='javascript:void(0)' className='text-grey'>
                  {email}
                </a>
              </div>
            </div>
          </div>

          <div className='search-wrapper'>
            <SearchBox
              placeholder='Search or start new chat'
              onChange={this.updateSearchChatUser}
              value={this.state.search}
            />
          </div>
        </div>

        <div className='chat-sidenav-content'>
          <AppBar position='static' className='no-shadow chat-tabs-header'>
            <Tabs
              className='chat-tabs'
              value={this.state.selectedTabIndex}
              onChange={this.handleChange}
              indicatorColor='primary'
              textColor='primary'
              fullWidth
            >
              <Tab label={<IntlMessages id='chat.chatUser' />} />
              <Tab label={<IntlMessages id='chat.contacts' />} />
            </Tabs>
          </AppBar>
          <SwipeableViews
            index={this.state.selectedTabIndex}
            onChangeIndex={this.handleChangeIndex}
          >
            <CustomScrollbars
              className='chat-sidenav-scroll scrollbar'
              style={{
                height: this.props.width >= 1200
                  ? 'calc(100vh - 328px)'
                  : 'calc(100vh - 202px)'
              }}
            >
              {this.state.chatList.length === 0
                ? <div className='p-5'>User not found</div>
                : <ChatUserList
                  chatUsers={this.state.chatListSearch}
                  selectedSectionId={this.state.selectedSectionId}
                  onSelectUser={this.onSelectUser}
                  uid={this.props.authUser.uid}
                  />}
            </CustomScrollbars>

            <CustomScrollbars
              className='chat-sidenav-scroll scrollbar'
              style={{
                height: this.props.width >= 1200
                  ? 'calc(100vh - 328px)'
                  : 'calc(100vh - 202px)'
              }}
            >
              <div className='w-50 mx-auto my-2'>
                <Button
                  variant='contained'
                  color='secondary'
                  onClick={this.toggleDialogAddContact}
                >
                  Add Contact
                  <AddIcon />
                </Button>
              </div>
              {this.state.contactList.length === 0
                ? <div className='p-5'>User not found</div>
                : <ContactList
                  contactList={this.state.contactListSearch}
                  selectedSectionId={this.state.selectedSectionId}
                  onSelectUser={this.onSelectUser}
                  />}
            </CustomScrollbars>
          </SwipeableViews>

          {/* dialog for add contact */}

          <Dialog
            onClose={this.toggleDialogAddContact}
            aria-labelledby='simple-dialog-title'
            open={dialogAddContact}
          >
            <DialogTitle id='simple-dialog-title'>
              Set backup account
            </DialogTitle>
            <div>
              <CustomScrollbars style={{ height: 'calc(100vh - 700px)' }}>
                <List>
                  {allContacts.map(({ email, photoURL, uid }) => (
                    <ListItem button onClick={this.addContact(uid)} key={email}>
                      <ListItemAvatar>
                        <Avatar alt='avatar' src={photoURL || Default} />
                      </ListItemAvatar>
                      <ListItemText primary={email} />
                    </ListItem>
                  ))}
                </List>
              </CustomScrollbars>
            </div>
          </Dialog>
        </div>
      </div>
    )
  }

  updateMoodValue = evt => {
    this.setState({
      mood: evt.target.value
    })
  }

  submitMood = () => {
    const { uid } = this.props.authUser
    db
      .collection('users')
      .doc(uid)
      .update({
        mood: this.state.mood
      })
      .then(() => NotificationManager.success('Mood updated'))
      .catch(e => NotificationManager.error(e.message))
  }

  _handleKeyPressMood = e => {
    if (e.key === 'Enter') {
      this.submitMood()
    }
  }

  handleChangeStatus = e => {
    db
      .collection('users')
      .doc(this.props.authUser.uid)
      .update({
        status: e.target.value
      })
      .then(() => {
        NotificationManager.success('Status Updated')
        this.setState({ [e.target.name]: e.target.value })
      })
      .catch(e => NotificationManager.error(e.message))
  }

  AppUsersInfo = () => {
    const { displayName, photoURL } = this.props.authUser
    return (
      <div className='chat-sidenav-main'>
        <div className='bg-grey lighten-5 chat-sidenav-header'>
          <div className='chat-user-hd mb-0'>
            <IconButton
              className='back-to-chats-button size-30'
              aria-label='back button'
              onClick={() => {
                this.setState({
                  userState: 1
                })
              }}
            >
              <i className='zmdi zmdi-arrow-back' />
            </IconButton>
          </div>
          <div className='chat-user chat-user-center'>
            <div className='chat-avatar mx-auto'>
              <img
                src={photoURL || Default}
                className='avatar avatar-shadow rounded-circle size-60 huge'
                alt='John Doe'
              />
            </div>

            <div className='user-name h4 my-2'>{displayName}</div>
          </div>
        </div>
        <div className='chat-sidenav-content'>
          <CustomScrollbars
            className='chat-sidenav-scroll scrollbar'
            style={{
              height: this.props.width >= 1200
                ? 'calc(100vh - 328px)'
                : 'calc(100vh - 162px)'
            }}
          >
            <form className='p-4'>
              <div className='form-group mt-4'>
                <label>Mood</label>

                <Input
                  fullWidth
                  id='exampleTextarea'
                  multiline
                  rows={3}
                  onKeyUp={this._handleKeyPressMood}
                  onChange={this.updateMoodValue}
                  value={this.state.mood}
                  placeholder='Status'
                  margin='none'
                />
              </div>
            </form>
            <div className='p-4'>
              <FormControl>
                <InputLabel htmlFor='status'>Status</InputLabel>
                <Select
                  value={this.state.status}
                  onChange={this.handleChangeStatus}
                  inputProps={{
                    name: 'status',
                    id: 'status'
                  }}
                  style={{ width: '200%' }}
                >
                  <MenuItem value='online'>Online</MenuItem>
                  <MenuItem value='away'>Away</MenuItem>
                  <MenuItem value='offline'>Offline</MenuItem>
                </Select>
              </FormControl>
            </div>
          </CustomScrollbars>
        </div>
      </div>
    )
  }

  submitComment = () => {
    const { uid, photoURL, displayName } = this.props.authUser
    const { message, userSelected, currentChat, idChat } = this.state

    if (!currentChat.length) {
      // No chat yet
      db
        .collection('chats')
        .add({
          messages: firebase.firestore.FieldValue.arrayUnion({
            sender: uid,
            message,
            sentAt: new Date()
          }),
          unreadMessage: {
            [uid]: 0,
            [userSelected.uid]: 1
          },
          lastMessage: message
        })
        .then(doc => {
          db.collection('users').doc(uid).update({
            [`chats.${userSelected.uid}`]: doc.id
          })
          return db.collection('users').doc(userSelected.uid).update({
            [`chats.${uid}`]: doc.id
          })
        })
        .then(() =>
          db.collection('users').doc(userSelected.uid).update({
            [`messages.${uid}`]: {
              photoURL,
              displayName,
              time: new Date(),
              message,
              unreadMessage: 1
            }
          })
        )
        .then(() => {
          console.log('Message send')
          this.setState({ message: '' })
        })
        .catch(e => NotificationManager.error(e.message))
    } else {
      // Already a chat
      const docRef = db.collection('chats').doc(idChat)
      return db
        .runTransaction(transaction => {
          return transaction.get(docRef).then(doc => {
            transaction.update(docRef, {
              messages: firebase.firestore.FieldValue.arrayUnion({
                sender: uid,
                message,
                sentAt: new Date()
              }),
              [`unreadMessage.${uid}`]: 0,
              [`unreadMessage.${userSelected.uid}`]: doc.data().unreadMessage[
                userSelected.uid
              ] + 1,
              lastMessage: message
            })
          })
        })
        .then(() => {
          const docRef = db.collection('users').doc(userSelected.uid)
          return db.runTransaction(transaction => {
            return transaction.get(docRef).then(doc => {
              if (!doc.data().messages[uid]) {
                transaction.update(docRef, {
                  [`messages.${uid}`]: {
                    photoURL,
                    displayName,
                    time: new Date(),
                    message,
                    unreadMessage: 1
                  }
                })
              } else {
                transaction.update(docRef, {
                  [`messages.${uid}`]: {
                    photoURL,
                    displayName,
                    time: new Date(),
                    message,
                    unreadMessage: doc.data().messages[uid].unreadMessage + 1
                  }
                })
              }
            })
          })
        })
        .then(() => {
          console.log('Message send')
          this.setState({ message: '' })
        })
        .catch(e => NotificationManager.error(e.message))
    }
  }

  _handleKeyPressComment = e => {
    if (e.key === 'Enter') {
      this.submitComment()
    }
  }

  communication = () => {
    const { userSelected, message, currentChat } = this.state
    return (
      <div className='chat-main'>
        <div className='chat-main-header'>
          <IconButton
            className='d-block d-xl-none chat-btn'
            aria-label='Menu'
            onClick={this.onToggleDrawer}
          >
            <i className='zmdi zmdi-menu' style={{ marginTop: '6px' }} />
          </IconButton>
          <div className='chat-main-header-info'>
            <div className='chat-avatar mr-2'>
              <div className='chat-avatar-mode'>
                <img
                  src={userSelected.photoURL}
                  className='rounded-circle size-60'
                  alt=''
                />

                <span className={`chat-mode ${userSelected.status}`} />
              </div>
            </div>

            <div className='chat-contact-name'>{userSelected.displayName}</div>
          </div>
        </div>
        <CustomScrollbars
          className='chat-list-scroll scrollbar'
          style={{
            height: this.props.width >= 1200
              ? 'calc(100vh - 300px)'
              : 'calc(100vh - 280px)'
          }}
        >
          <Conversation
            conversationData={currentChat}
            userSelected={userSelected}
            user={this.props.authUser}
          />
        </CustomScrollbars>
        <div className='chat-main-footer'>
          <div
            className='d-flex flex-row align-items-center'
            style={{ maxHeight: 51 }}
          >
            <div className='col'>
              <div className='form-group'>
                <textarea
                  id='required'
                  className='border-0 form-control chat-textarea'
                  onKeyUp={this._handleKeyPressComment}
                  onChange={e => this.setState({ message: e.target.value })}
                  value={message}
                  placeholder='Type and hit enter to send message'
                />
              </div>
            </div>
            <div className='chat-sent'>
              <IconButton
                onClick={this.submitComment}
                aria-label='Send message'
              >
                <i
                  className='zmdi  zmdi-mail-send'
                  style={{ marginTop: '4px' }}
                />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    )
  }

  showCommunication = () => (
    <div className='chat-box'>
      {this.state.userSelected === null
        ? <div className='chat-box-main'>
          <div className='loader-view'>
            <i className='zmdi zmdi-comment s-128 text-muted' />
            <h1 className='text-muted'>
              {<IntlMessages id='chat.selectUserChat' />}
            </h1>
            <Button
              className='d-block d-xl-none'
              color='primary'
              onClick={this.onToggleDrawer}
              >
              {<IntlMessages id='chat.selectContactChat' />}
            </Button>
          </div>
        </div>
        : this.communication()}
    </div>
  )

  onToggleDrawer = () => this.setState({ drawerState: !this.state.drawerState })

  render () {
    const { drawerState, userState, loader } = this.state

    return (
      <div className='app-wrapper app-wrapper-module'>
        <div className='app-module chat-module animated slideInUpTiny animation-duration-5'>
          <div className='chat-module-box'>
            <div className='d-block d-xl-none'>
              <Drawer open={drawerState} onClose={this.onToggleDrawer}>
                {userState === 1 ? this.ChatUsers() : this.AppUsersInfo()}
              </Drawer>
            </div>
            <div className='chat-sidenav d-none d-xl-flex'>
              {userState === 1 ? this.ChatUsers() : this.AppUsersInfo()}
            </div>
            {loader
              ? <div
                className='loader-view w-100'
                style={{ height: 'calc(100vh - 120px)' }}
                >
                <CircularProgress />
              </div>
              : this.showCommunication()}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ auth, settings }) => {
  const { authUser } = auth
  const { width } = settings
  return { authUser, width }
}

export default connect(mapStateToProps, {})(Chat)
