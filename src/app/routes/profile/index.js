import React, { Component } from 'react';
import { connect } from 'react-redux';
import ContainerHeader from 'components/ContainerHeader/index';
import IntlMessages from 'util/IntlMessages';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Foot from 'assets/images/products/football.jpeg';
import iPhone from 'assets/images/products/iPhone.jpeg';
import { functions } from 'helper/firebase';
import { NotificationManager } from 'react-notifications';

export class Profile extends Component {
  state = {
    topic: '',
    loader: false
  };

  render() {
    const { loader } = this.state;
    const topics = [
      { name: 'Foot', decription: 'Topics on europeen leagues', photo: Foot },
      {
        name: 'iPhone',
        decription: 'Topics tech on last iPhone news',
        photo: iPhone
      }
    ];

    return (
      <div className="app-wrapper">
        <div className="dashboard animated slideInUpTiny animation-duration-5">
          <ContainerHeader
            match={this.props.match}
            title={<IntlMessages id="popup.profile" />}
          />
          <div className="row">
            <div className="col-12 col-md-5 mb-3">
              <Card>
                <CardContent className="border-bottom border-grey-lighten-2 pb-0">
                  <h3>Subscribe to topics</h3>
                  <ul className="p-0">
                    {topics.map((topic, index) => (
                      <li
                        className="d-flex align-items-center mb-1"
                        key={index}
                      >
                        <Avatar alt="" src={topic.photo} className="mr-3" />
                        <div>
                          <h4 className="m-0">{topic.name}</h4>
                          <small>{topic.decription}</small>
                        </div>
                        <div className="ml-auto d-flex flex-column">
                          <Button
                            variant="contained"
                            color="primary"
                            className="jr-btn jr-btn-xs m-1"
                            onClick={() => {
                              functions
                                .httpsCallable('subscribeToTopic')({
                                  topic: topic.name,
                                  token: this.props.authUser.tokenFCM
                                })
                                .then(res => {
                                  const { done, message } = res.data;
                                  if (done) {
                                    NotificationManager.success(message);
                                  } else {
                                    NotificationManager.error(message);
                                  }
                                })
                                .catch(e => NotificationManager.error(e));
                            }}
                          >
                            Subscribe
                          </Button>
                          <Button
                            variant="outlined"
                            color="primary"
                            className="jr-btn jr-btn-xs m-1"
                            onClick={() => {
                              functions
                                .httpsCallable('unsubscribeFromTopic')({
                                  topic: topic.name,
                                  token: this.props.authUser.tokenFCM
                                })
                                .then(res => {
                                  const { done, message } = res.data;
                                  if (done) {
                                    NotificationManager.success(message);
                                  } else {
                                    NotificationManager.error(message);
                                  }
                                })
                                .catch(e => NotificationManager.error(e));
                            }}
                          >
                            Unsubscribe
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardActions className="d-flex align-items-end">
                  <FormControl className="w-50 ml-5">
                    <InputLabel htmlFor="topics">Topics</InputLabel>
                    <Select
                      value={this.state.topic}
                      onChange={e =>
                        this.setState({ [e.target.name]: e.target.value })
                      }
                      inputProps={{
                        name: 'topic',
                        id: 'topics'
                      }}
                    >
                      {topics.map((topic, index) => (
                        <MenuItem key={index} value={topic.name}>
                          {topic.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    variant="contained"
                    color="secondary"
                    className="jr-btn jr-btn-xs ml-auto"
                    onClick={() => {
                      functions
                        .httpsCallable('sendPushMessageToTopic')({
                          topic: this.state.topic
                        })
                        .then(res => {
                          const { done, message } = res.data;
                          if (done) {
                            NotificationManager.success(message);
                          } else {
                            NotificationManager.error(message);
                          }
                        })
                        .catch(e => NotificationManager.error(e));
                    }}
                  >
                    {loader ? (
                      <i className="zmdi zmdi-spinner zmdi-hc-spin px-4" />
                    ) : (
                      'Send Notification'
                    )}
                  </Button>
                </CardActions>
              </Card>
            </div>
            <div className="col-12 col-md-7 mb-3">
              <Card>
                <CardContent />
                <CardActions />
              </Card>
            </div>
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
)(Profile);
