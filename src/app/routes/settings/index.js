import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import ContainerHeader from 'components/ContainerHeader/index';
import IntlMessages from 'util/IntlMessages';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import Dropzone from 'react-dropzone';
import { auth, storage } from 'helper/firebase';
import { updateAccount, showAuthMessage, hideMessage } from 'actions/Auth';
import { NotificationManager } from 'react-notifications';
import SweetAlert from 'react-bootstrap-sweetalert';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
export class Settings extends Component {
  state = {
    name: '',
    email: '',
    verified: false,
    file: null,
    warning: false,
    loading: false,
    pass: false,
    password: '',
    confirmPassword: '',
    showPassword: false,
    showConfirmPassword: false
  };

  componentDidUpdate() {
    if (this.props.showMessage) {
      setTimeout(() => {
        this.props.hideMessage();
      }, 100);
    }
  }

  componentDidMount = () => {
    this.props.authUser.emailVerified &&
      this.setState({ verified: this.props.authUser.emailVerified });
    this.props.authUser.displayName &&
      this.setState({ name: this.props.authUser.displayName });
    this.props.authUser.email &&
      this.setState({ email: this.props.authUser.email });
  };

  toggleWarning = () => {
    this.setState({ warning: !this.state.warning });
  };

  togglePass = () => {
    this.setState({ pass: !this.state.pass });
  };

  deleteAccount = () => {
    const user = auth.currentUser;
    user
      .delete()
      .then(() => console.log('User account delete'))
      .catch(e => this.props.showAuthMessage(e.message));
    this.toggleWarning();
  };

  updateAccount = () => {
    const { name, email, file } = this.state;
    const user = auth.currentUser;
    this.setState({ loading: true });
    file &&
      storage
        .ref()
        .child(`userPhoto/${user.uid}`)
        .put(file)
        .then(() =>
          storage
            .ref()
            .child(`userPhoto/${user.uid}`)
            .getDownloadURL()
        )
        .then(url => {
          console.log(url);
          return user.updateProfile({
            displayName: name,
            photoURL: url
          });
        })
        .then(() => user.updateEmail(email))
        .then(() => {
          console.log('Account updated');
          this.props.updateAccount({
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL
          });
          this.setState({ file: null, loading: false });
        })
        .catch(e => {
          this.props.showAuthMessage(e.message);
          this.setState({ loading: false });
        });

    !file &&
      user
        .updateProfile({
          displayName: name
        })
        .then(() => user.updateEmail(email))
        .then(() => {
          console.log('Account updated');
          this.props.updateAccount({
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL
          });
          this.setState({ loading: false });
        })
        .catch(e => this.props.showAuthMessage(e.message));
  };

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  handleClickShowConfirmPassword = () => {
    this.setState(state => ({
      showConfirmPassword: !state.showConfirmPassword
    }));
  };

  render() {
    const {
      file,
      warning,
      loading,
      pass,
      password,
      confirmPassword,
      showPassword,
      showConfirmPassword
    } = this.state;
    const { authUser, showMessage, alertMessage } = this.props;
    return (
      <div className="app-wrapper">
        <div className="dashboard animated slideInUpTiny animation-duration-3">
          <ContainerHeader
            match={this.props.match}
            title={<IntlMessages id="popup.setting" />}
          />
          <Card>
            <CardContent>
              <div className="container">
                <div className="row">
                  <div className="col-3 align-self-end">
                    <h3>
                      <IntlMessages id="settings.changeName" />:
                    </h3>
                  </div>
                  <div className="col">
                    <TextField
                      type="text"
                      label="Name"
                      onChange={event =>
                        this.setState({ name: event.target.value })
                      }
                      fullWidth
                      defaultValue={authUser.displayName}
                      margin="normal"
                      className="mt-0 mb-2"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-3 align-self-end">
                    <h3>
                      <IntlMessages id="settings.changeEmail" />:
                    </h3>
                  </div>
                  <div className="col">
                    <TextField
                      type="email"
                      onChange={event =>
                        this.setState({ email: event.target.value })
                      }
                      label={<IntlMessages id="appModule.email" />}
                      fullWidth
                      defaultValue={authUser.email}
                      margin="normal"
                      className="mt-0 mb-2"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-3 align-self-end">
                    <h4>
                      <IntlMessages id="settings.emailVerified" />:
                    </h4>
                  </div>
                  <div className="col">
                    <Switch
                      checked={authUser.emailVerified}
                      value="verified"
                      color="primary"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-3  align-self-center">
                    <h4>
                      <IntlMessages id="settings.changePhoto" />:
                    </h4>
                  </div>
                  <div className="col">
                    <div className="dropzone-card">
                      <div className="dropzone">
                        <Dropzone
                          accept="image/jpeg, image/png"
                          onDrop={(accepted, rejected) => {
                            this.setState({ file: accepted[0] });
                          }}
                        >
                          {file ? (
                            <img
                              src={file.preview}
                              alt="preview"
                              style={{ height: '150px' }}
                            />
                          ) : (
                            <Fragment>
                              <p>
                                Try dropping some files here, or click to select
                                files to upload.
                              </p>
                              <p className="mb-0">
                                Only *.jpeg and *.png images will be accepted
                              </p>
                            </Fragment>
                          )}
                        </Dropzone>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-5 align-self-center">
                    <h4>
                      <IntlMessages id="settings.changePass" />:
                    </h4>
                  </div>
                  <div className="col">
                    <Button
                      variant="contained"
                      size="small"
                      color="default"
                      className="m-2"
                      onClick={this.togglePass}
                    >
                      <IntlMessages id="settings.updatePass" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardActions>
              <div className="mx-auto">
                <Button
                  variant="contained"
                  size="small"
                  color="secondary"
                  className="m-2"
                  onClick={this.toggleWarning}
                >
                  <IntlMessages id="settings.deleteAccount" />
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  className="m-2"
                  onClick={this.updateAccount}
                >
                  {!loading ? (
                    <IntlMessages id="settings.updateAccount" />
                  ) : (
                    <CircularProgress size={18} style={{ color: 'green' }} />
                  )}
                </Button>
              </div>
            </CardActions>
          </Card>

          <SweetAlert
            show={warning}
            warning
            showCancel
            confirmBtnText={<IntlMessages id="sweetAlerts.yesDeleteIt" />}
            confirmBtnBsStyle="danger"
            cancelBtnBsStyle="default"
            title={<IntlMessages id="sweetAlerts.areYouSure" />}
            onConfirm={this.deleteAccount}
            onCancel={this.toggleWarning}
          >
            <IntlMessages id="sweetAlerts.youWillNotAble" />
          </SweetAlert>

          <Dialog open={pass} onClose={this.togglePass}>
            <DialogTitle>Subscribe</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To subscribe to this website, please enter your email address
                here. We will send updates occationally.
              </DialogContentText>
              <FormControl fullWidth>
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input
                  id="password"
                  type={this.state.showPassword ? 'text' : 'password'}
                  value={password}
                  name="password"
                  onChange={e =>
                    this.setState({ [e.target.name]: e.target.value })
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={this.handleClickShowPassword}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              <FormControl fullWidth>
                <InputLabel htmlFor="confirmPassword">
                  Confirm Password
                </InputLabel>
                <Input
                  id="confirmPassword"
                  type={this.state.showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  name="confirmPassword"
                  onChange={e =>
                    this.setState({ [e.target.name]: e.target.value })
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle confirm password visibility"
                        onClick={this.handleClickShowConfirmPassword}
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.togglePass} color="secondary">
                Cancel
              </Button>
              <Button onClick={this.togglePass} color="primary">
                Subscribe
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        {showMessage && NotificationManager.error(alertMessage)}
      </div>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  const { authUser, showMessage, alertMessage } = auth;
  return { authUser, showMessage, alertMessage };
};

export default connect(
  mapStateToProps,
  { updateAccount, showAuthMessage, hideMessage }
)(Settings);
