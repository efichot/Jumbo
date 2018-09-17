import React, {Component} from 'react';
import {connect} from 'react-redux'
import Button from '@material-ui/core/Button';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Drawer from '@material-ui/core/Drawer';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton'
import Input from '@material-ui/core/Input'
import ChatUserList from 'components/chatPanel/ChatUserList/index';
import Conversation from 'components/chatPanel/Conversation/index';
import ContactList from 'components/chatPanel/ContactList/index';
import SearchBox from 'components/SearchBox';
import IntlMessages from 'util/IntlMessages';
import {
  fetchChatUser,
  fetchChatUserConversation,
  filterContacts,
  filterUsers,
  hideLoader,
  onChatToggleDrawer,
  onSelectUser,
  submitComment,
  updateMessageValue,
  updateSearchChatUser,
  userInfoState
} from 'actions/Chat'
import CustomScrollbars from 'util/CustomScrollbars';

class ChatPanelWithRedux extends Component {
  filterContacts = (userName) => {
    this.props.filterContacts(userName);
  };
  filterUsers = (userName) => {
    this.props.filterUsers(userName);
  };
  _handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.submitComment();
    }
  };

  onSelectUser = (user) => {
    this.props.onSelectUser(user);

    setTimeout(() => {
      this.props.hideLoader();
    }, 1500);
  };


  submitComment = () => {
    if (this.props.message !== '') {
      this.props.submitComment();
    }
  };

  updateMessageValue = (evt) => {
    this.props.updateMessageValue(evt.target.value);

  };

  Communication = () => {
    const {message, selectedUser, conversation} = this.props;
    const {conversationData} = conversation;
    return <div className="chat-main">
      <div className="chat-main-header">
        <IconButton className="d-block d-xl-none chat-btn" aria-label="Menu"
                    onClick={this.onChatToggleDrawer.bind(this)}>
          <i className="zmdi zmdi-comment-text"/>
        </IconButton>
        <div className="chat-main-header-info">

          <div className="chat-avatar mr-2">
            <div className="chat-avatar-mode">
              <img src={selectedUser.thumb}
                   className="rounded-circle size-60"
                   alt=""/>

              <span className={`chat-mode ${selectedUser.status}`}/>
            </div>
          </div>

          <div className="chat-contact-name">
            {selectedUser.name}
          </div>
        </div>

      </div>

      <CustomScrollbars className="chat-list-scroll scrollbar"
                        style={{height: this.props.width >= 1200 ? 'calc(100vh - 300px)' : 'calc(100vh - 255px)'}}>
        <Conversation conversationData={conversationData}
                      selectedUser={selectedUser}/>
      </CustomScrollbars>

      <div className="chat-main-footer">
        <div className="d-flex flex-row align-items-center" style={{maxHeight: 51}}>
          <div className="col">
            <div className="form-group">
                            <textarea
                              id="required" className="border-0 form-control chat-textarea"
                              onKeyUp={this._handleKeyPress.bind(this)}
                              onChange={this.updateMessageValue.bind(this)}
                              value={message}
                              placeholder="Type and hit enter to send message"
                            />
            </div>
          </div>
          <div className="chat-sent">
            <IconButton
              onClick={this.submitComment.bind(this)}
              aria-label="Send message">
              <i className="zmdi  zmdi-mail-send"/>
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  };

  AppUsersInfo = () => {
    return <div className="chat-sidenav-main">
      <div className="bg-grey lighten-5 chat-sidenav-header">

        <div className="chat-user-hd mb-0">
          <IconButton className="back-to-chats-button size-30" aria-label="back button"
                      onClick={() => {
                        this.setState({
                          userState: 1
                        });
                      }}>
            <i className="zmdi zmdi-arrow-back"/>
          </IconButton>
        </div>
        <div className="chat-user chat-user-center">
          <div className="chat-avatar mx-auto">
            <img src="http://via.placeholder.com/150x150"
                 className="avatar avatar-shadow rounded-circle size-60 huge" alt="John Doe"/>
          </div>

          <div className="user-name h4 my-2 text-white">Robert Johnson</div>

        </div>
      </div>
      <div className="chat-sidenav-content">

        <CustomScrollbars className="chat-sidenav-scroll scrollbar"
                          style={{height: this.props.width >= 1200 ? 'calc(100vh - 328px)' : 'calc(100vh - 162px)'}}>
          <form className="p-4">
            <div className="form-group mt-4">
              <label>Mood</label>

              <Input
                fullWidth
                id="exampleTextarea"
                multiline
                rows={3}
                onKeyUp={this._handleKeyPress.bind(this)}
                onChange={this.updateMessageValue.bind(this)}
                defaultValue="it's a status....not your diary..."
                placeholder="Status"
                margin="none"/>

            </div>
          </form>
        </CustomScrollbars>

      </div>
    </div>
  };
  ChatUsers = () => {
    return <div className="chat-sidenav-main">
      <div className="chat-sidenav-header">

        <div className="chat-user-hd">

          <div className="chat-avatar mr-3" onClick={() => {
            this.props.userInfoState(2);
          }}>
            <div className="chat-avatar-mode">
              <img id="user-avatar-button" src="http://via.placeholder.com/150x150"
                   className="rounded-circle size-50"
                   alt=""/>
              <span className="chat-mode online"/>
            </div>
          </div>
          <div className="module-user-info d-flex flex-column justify-content-center">
            <div className="module-title">
              <h5 className="mb-0">Robert Johnson</h5>
            </div>
            <div className="module-user-detail">
              <a href="javascript:void(0)" className="text-grey">robert@example.com</a>
            </div>
          </div>
        </div>

        <div className="search-wrapper">

          <SearchBox placeholder="Search or start new chat"
                     onChange={this.updateSearchChatUser.bind(this)}
                     value={this.props.searchChatUser}/>

        </div>
      </div>

      <div className="chat-sidenav-content">
        <AppBar position="static" className="no-shadow chat-tabs-header">
          <Tabs
            className="chat-tabs"
            value={this.state.selectedTabIndex}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            fullWidth
          >
            <Tab label={<IntlMessages id="chat.chatUser"/>}/>
            <Tab label={<IntlMessages id="chat.contacts"/>}/>
          </Tabs>
        </AppBar>
        <SwipeableViews
          index={this.state.selectedTabIndex}
          onChangeIndex={this.handleChangeIndex}
        >
          <CustomScrollbars className="chat-sidenav-scroll scrollbar"
                            style={{height: this.props.width >= 1200 ? 'calc(100vh - 328px)' : 'calc(100vh - 202px)'}}>
            {this.props.chatUsers.length === 0 ?
              <div className="p-5">{this.props.userNotFound}</div>
              :
              <ChatUserList chatUsers={this.props.chatUsers}
                            selectedSectionId={this.props.selectedSectionId}
                            onSelectUser={this.onSelectUser.bind(this)}/>
            }
          </CustomScrollbars>

          <CustomScrollbars className="chat-sidenav-scroll scrollbar"
                            style={{height: this.props.width >= 1200 ? 'calc(100vh - 328px)' : 'calc(100vh - 202px)'}}>
            {
              this.props.contactList.length === 0 ?
                <div className="p-5">{this.props.userNotFound}</div>
                :
                <ContactList contactList={this.props.contactList}
                             selectedSectionId={this.props.selectedSectionId}
                             onSelectUser={this.onSelectUser.bind(this)}/>
            }
          </CustomScrollbars>
        </SwipeableViews>

      </div>
    </div>
  };
  handleChange = (event, value) => {
    this.setState({selectedTabIndex: value});
  };

  handleChangeIndex = index => {
    this.setState({selectedTabIndex: index});
  };
  showCommunication = () => {
    return (
      <div className="chat-box">
        <div className="chat-box-main">{
          this.props.selectedUser === null ?
            <div className="loader-view">
              <i className="zmdi zmdi-comment s-128 text-muted"/>
              <h1 className="text-muted"> {<IntlMessages id="chat.selectUserChat"/>}</h1>
              <Button className="d-block d-xl-none" color="primary"
                      onClick={this.onChatToggleDrawer.bind(this)}>{<IntlMessages
                id="chat.selectContactChat"/>}</Button>
            </div>
            : this.Communication()}
        </div>
      </div>)
  };

  constructor() {
    super();
    this.state = {
      selectedTabIndex: 0,
    }
  }

  componentWillMount() {
    // this.props.fetchChatUser();
    // this.props.fetchChatUserConversation()
  }

  updateSearchChatUser(evt) {
    this.props.updateSearchChatUser(evt.target.value);
    this.props.filterContacts(evt.target.value);
    this.props.filterUsers(evt.target.value);
  }

  onChatToggleDrawer() {
    this.props.onChatToggleDrawer();
  }

  render() {
    const {loader, userState, drawerState, selectedUser} = this.props;
    return (
      <div className="app-wrapper app-wrapper-module">
        <div className="app-module chat-module animated slideInUpTiny animation-duration-3">
          <div className="chat-module-box">
            <div className="d-block d-xl-none">
              <Drawer open={drawerState}
                      onClose={this.onChatToggleDrawer.bind(this)}>
                {userState === 1 ? this.ChatUsers() : this.AppUsersInfo()}
              </Drawer>
            </div>
            <div className="chat-sidenav d-none d-xl-flex">
              {userState === 1 ? this.ChatUsers() : this.AppUsersInfo()}
            </div>
            {loader ?
              <div className="loader-view w-100"
                   style={{height: 'calc(100vh - 120px)'}}>
                <CircularProgress/>
              </div> : this.showCommunication()
            }
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({chatData, settings}) => {
  const {width} = settings;
  const {
    loader,
    userNotFound,
    drawerState,
    selectedSectionId,
    userState,
    searchChatUser,
    contactList,
    selectedUser,
    message,
    chatUsers,
    conversationList,
    conversation
  } = chatData;
  return {
    width,
    loader,
    userNotFound,
    drawerState,
    selectedSectionId,
    userState,
    searchChatUser,
    contactList,
    selectedUser,
    message,
    chatUsers,
    conversationList,
    conversation
  }
};

export default connect(mapStateToProps, {
  fetchChatUser,
  fetchChatUserConversation,
  filterContacts,
  filterUsers,
  onSelectUser,
  hideLoader,
  userInfoState,
  submitComment,
  updateMessageValue,
  updateSearchChatUser,
  onChatToggleDrawer
})(ChatPanelWithRedux);