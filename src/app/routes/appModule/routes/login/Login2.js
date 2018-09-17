import React from 'react';
import {Link} from 'react-router-dom'
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IntlMessages from 'util/IntlMessages';

class Login2 extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      password: ''
    }
  }

  render() {
    const {
      email,
      password
    } = this.state;
    return (
      <div
        className="login-container d-flex justify-content-center align-items-center animated slideInUpTiny animation-duration-3">
        <div className="login-content">
          <div className="login-header mb-4">
            <Link className="app-logo" to="/" title="Jambo">
              <img src="http://via.placeholder.com/177x65" alt="jambo" title="jambo"/>
            </Link>
          </div>

          <div className="login-form">
            <form>
              <fieldset>
                <TextField
                  id="required"
                  label={<IntlMessages id="appModule.email"/>}
                  fullWidth
                  onChange={(event) => this.setState({email: event.target.value})}
                  defaultValue={email}
                  margin="normal"
                  className="mt-1"
                />
                <TextField
                  type="password"
                  id="required"
                  label={<IntlMessages id="appModule.password"/>}
                  fullWidth
                  onChange={(event) => this.setState({password: event.target.value})}
                  defaultValue={password}
                  margin="normal"
                  className="mt-1"
                />
                <div className="mt-1 mb-2 d-flex justify-content-between align-items-center">
                  <FormControlLabel
                    control={
                      <Checkbox color="primary"
                                value="gilad"
                      />
                    }
                    label={<IntlMessages id="appModule.rememberMe"/>}
                  />

                  <div>
                    <Link to="/app/app-module/forgot-password-2"
                          title="Reset Password"><IntlMessages
                      id="appModule.forgotPassword"/></Link>
                  </div>
                </div>

                <Button color="primary" variant="raised" component={Link} to="/" className="text-white">
                  <IntlMessages id="appModule.signIn"/>
                </Button>

              </fieldset>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Login2;
