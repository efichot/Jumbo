import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IntlMessages from 'util/IntlMessages';
import CircularProgress from '@material-ui/core/CircularProgress';
import iota from 'assets/images/iota_light.svg';
import {
  hideMessage,
  showAuthLoader,
  hideAuthLoader,
  resetPass
} from 'actions/Auth';
import {
  NotificationContainer,
  NotificationManager
} from 'react-notifications';

class ResetPass extends React.Component {
  state = {
    email: ''
  };

  componentDidMount = () => {
    if (this.props.authUser !== null) {
      this.props.history.push('/');
    }
  };

  componentDidUpdate() {
    if (this.props.showMessage) {
      setTimeout(() => {
        this.props.hideMessage();
      }, 100);
    }
    if (this.props.authUser !== null) {
      this.props.history.push('/');
    }
  }

  render() {
    const { email } = this.state;
    const {
      showMessage,
      loader,
      alertMessage,
      showAuthLoader,
      successMessage,
      resetPass
    } = this.props;
    return (
      <div className="app-login-container d-flex justify-content-center align-items-center animated slideInUpTiny animation-duration-3">
        <div className="app-login-main-content">
          <div className="app-logo-content d-flex align-items-center justify-content-center">
            <Link className="logo-lg" to="/" title="Jambo">
              <img
                src={iota}
                alt="jambo"
                title="jambo"
                style={{ width: '100%' }}
              />
            </Link>
          </div>

          <div className="app-login-content">
            <div className="app-login-header mb-4">
              <h1>
                <IntlMessages id="appModule.email" />
              </h1>
            </div>

            <div className="app-login-form">
              <form>
                <fieldset>
                  <TextField
                    label={<IntlMessages id="appModule.email" />}
                    fullWidth
                    onChange={event =>
                      this.setState({ email: event.target.value })
                    }
                    defaultValue={email}
                    margin="normal"
                    className="mt-1 my-sm-3"
                  />

                  <div className="mb-3 d-flex align-items-center justify-content-between">
                    <Button
                      onClick={() => {
                        showAuthLoader();
                        resetPass({ email });
                      }}
                      variant="raised"
                      color="primary"
                    >
                      <IntlMessages id="appModule.resetPass" />
                    </Button>

                    <Link to="/signin">
                      <IntlMessages id="appModule.returnSignInPage" />
                    </Link>
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
        {loader && (
          <div className="loader-view">
            <CircularProgress />
          </div>
        )}
        {showMessage &&
          alertMessage !== '' &&
          NotificationManager.error(alertMessage)}
        {showMessage &&
          successMessage !== '' &&
          NotificationManager.success(successMessage)}
        <NotificationContainer />
      </div>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  const { loader, alertMessage, showMessage, authUser, successMessage } = auth;
  return { loader, alertMessage, showMessage, authUser, successMessage };
};

export default connect(
  mapStateToProps,
  {
    hideMessage,
    showAuthLoader,
    hideAuthLoader,
    resetPass
  }
)(ResetPass);
