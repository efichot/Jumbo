import React, { Component } from 'react';
import { connect } from 'react-redux';
import Drawer from '@material-ui/core/Drawer';
import SearchBox from 'components/SearchBox/index';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import IntlMessages from 'util/IntlMessages';
import SwipeableViews from 'react-swipeable-views';
import CustomScrollbars from 'util/CustomScrollbars';
import ContactList from 'components/chatPanel/ContactList/index';
import ChatUserList from 'components/chatPanel/ChatUserList';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';

export class Chat extends Component {
  state = {
    drawerState: false,
    userState: 1,
    search: '',
    selectedTabIndex: 0,
    selectedSectionId: '',
    chatUsers: [],
    contactList: [],
    mood: ''
  };

  componentDidMount = () => {};

  updateSearchChatUser = evt => {
    this.setState({
      search: evt.target.value,
      contactList: [],
      chatUsers: []
    });
  };

  handleChange = (event, value) => {
    this.setState({ selectedTabIndex: value });
  };

  handleChangeIndex = index => {
    this.setState({ selectedTabIndex: index });
  };

  ChatUsers = () => {
    const { displayName, photoURL, email } = this.props.authUser;
    return (
      <div className="chat-sidenav-main">
        <div className="chat-sidenav-header">
          <div className="chat-user-hd">
            <div
              className="chat-avatar mr-3"
              onClick={() => {
                this.setState({
                  userState: 2
                });
              }}
            >
              <div className="chat-avatar-mode">
                <img
                  id="user-avatar-button"
                  src={photoURL}
                  className="rounded-circle size-50"
                  alt=""
                />
                <span className="chat-mode online" />
              </div>
            </div>

            <div className="module-user-info d-flex flex-column justify-content-center">
              <div className="module-title">
                <h5 className="mb-0">{displayName}</h5>
              </div>
              <div className="module-user-detail">
                <a href="javascript:void(0)" className="text-grey">
                  {email}
                </a>
              </div>
            </div>
          </div>

          <div className="search-wrapper">
            <SearchBox
              placeholder="Search or start new chat"
              onChange={this.updateSearchChatUser}
              value={this.state.search}
            />
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
              <Tab label={<IntlMessages id="chat.chatUser" />} />
              <Tab label={<IntlMessages id="chat.contacts" />} />
            </Tabs>
          </AppBar>
          <SwipeableViews
            index={this.state.selectedTabIndex}
            onChangeIndex={this.handleChangeIndex}
          >
            <CustomScrollbars
              className="chat-sidenav-scroll scrollbar"
              style={{
                height:
                  this.props.width >= 1200
                    ? 'calc(100vh - 328px)'
                    : 'calc(100vh - 202px)'
              }}
            >
              {this.state.chatUsers.length === 0 ? (
                <div className="p-5">User not found</div>
              ) : (
                <ChatUserList
                  chatUsers={this.state.chatUsers}
                  selectedSectionId={this.state.selectedSectionId}
                  onSelectUser={this.onSelectUser.bind(this)}
                />
              )}
            </CustomScrollbars>

            <CustomScrollbars
              className="chat-sidenav-scroll scrollbar"
              style={{
                height:
                  this.props.width >= 1200
                    ? 'calc(100vh - 328px)'
                    : 'calc(100vh - 202px)'
              }}
            >
              {this.state.contactList.length === 0 ? (
                <div className="p-5">User not found</div>
              ) : (
                <ContactList
                  contactList={this.state.contactList}
                  selectedSectionId={this.state.selectedSectionId}
                  onSelectUser={this.onSelectUser.bind(this)}
                />
              )}
            </CustomScrollbars>
          </SwipeableViews>
        </div>
      </div>
    );
  };

  updateMessageValue = evt => {
    this.setState({
      mood: evt.target.value
    });
  };

  submitMood = () => {};

  _handleKeyPress = e => {
    if (e.key === 'Enter') {
      this.submitMood();
    }
  };

  AppUsersInfo = () => {
    const { displayName, photoURL } = this.props.authUser;
    return (
      <div className="chat-sidenav-main">
        <div className="bg-grey lighten-5 chat-sidenav-header">
          <div className="chat-user-hd mb-0">
            <IconButton
              className="back-to-chats-button size-30"
              aria-label="back button"
              onClick={() => {
                this.setState({
                  userState: 1
                });
              }}
            >
              <i className="zmdi zmdi-arrow-back" />
            </IconButton>
          </div>
          <div className="chat-user chat-user-center">
            <div className="chat-avatar mx-auto">
              <img
                src={photoURL}
                className="avatar avatar-shadow rounded-circle size-60 huge"
                alt="John Doe"
              />
            </div>

            <div className="user-name h4 my-2">{displayName}</div>
          </div>
        </div>
        <div className="chat-sidenav-content">
          <CustomScrollbars
            className="chat-sidenav-scroll scrollbar"
            style={{
              height:
                this.props.width >= 1200
                  ? 'calc(100vh - 328px)'
                  : 'calc(100vh - 162px)'
            }}
          >
            <form className="p-4">
              <div className="form-group mt-4">
                <label>Mood</label>

                <Input
                  fullWidth
                  id="exampleTextarea"
                  multiline
                  rows={3}
                  onKeyUp={this._handleKeyPress}
                  onChange={this.updateMessageValue}
                  defaultValue="it's a status....not your diary..."
                  placeholder="Status"
                  margin="none"
                />
              </div>
            </form>
          </CustomScrollbars>
        </div>
      </div>
    );
  };

  onToggleDrawer = () =>
    this.setState({ drawerState: !this.state.drawerState });

  render() {
    const { drawerState, userState, loader } = this.state;

    return (
      <div className="app-wrapper app-wrapper-module">
        <div className="app-module chat-module animated slideInUpTiny animation-duration-3">
          <div className="chat-module-box">
            <div className="d-block d-xl-none">
              <Drawer open={drawerState} onClose={this.onToggleDrawer}>
                {userState === 1 ? this.ChatUsers() : this.AppUsersInfo()}
              </Drawer>
            </div>
            <div className="chat-sidenav d-none d-xl-flex">
              {userState === 1 ? this.ChatUsers() : this.AppUsersInfo()}
            </div>
            {loader ? (
              <div
                className="loader-view w-100"
                style={{ height: 'calc(100vh - 120px)' }}
              >
                <CircularProgress />
              </div>
            ) : (
              // this.showCommunication()
              'ee'
            )}
          </div>
        </div>
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
  {}
)(Chat);
