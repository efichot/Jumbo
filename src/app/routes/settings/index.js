import React, { Component, Fragment } from 'react'
import ContainerHeader from 'components/ContainerHeader/index'
import IntlMessages from 'util/IntlMessages'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Switch from '@material-ui/core/Switch'
import Dropzone from 'react-dropzone'
import { db, auth, storage } from 'helper/firebase'
import { NotificationManager } from 'react-notifications'
import SweetAlert from 'react-bootstrap-sweetalert'
import CircularProgress from '@material-ui/core/CircularProgress'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import IconButton from '@material-ui/core/IconButton'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContentText from '@material-ui/core/DialogContentText'
import Context from 'context'
export class Settings extends Component {
  static contextType = Context

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
    showConfirmPassword: false,
    match: false,
    success: false
  }

  componentDidMount = () => {
    const { emailVerified, displayName, email } = this.context.auth.authUser
    emailVerified && this.setState({ verified: emailVerified })
    displayName && this.setState({ name: displayName })
    email && this.setState({ email })
  }

  toggleWarning = () => {
    this.setState({ warning: !this.state.warning })
  }

  togglePass = () => {
    this.setState({
      pass: !this.state.pass,
      password: '',
      confirmPassword: ''
    })
  }

  deleteAccount = () => {
    const user = auth.currentUser
    user
      .delete()
      .then(() => console.log('User account delete'))
      .catch(e => NotificationManager.error(e.message))
    if (user.photoURL) {
      storage
        .ref()
        .child(`userPhoto/${user.uid}`)
        .delete()
        .then(() => console.log('Photo deleted inside the bucket'))
        .catch(e => console.log(e))
    }
    this.toggleWarning()
  }

  updateAccount = () => {
    const { name, email, file } = this.state
    const user = auth.currentUser
    this.setState({ loading: true })
    file &&
      storage
        .ref()
        .child(`userPhoto/${user.uid}`)
        .put(file)
        .then(() =>
          storage.ref().child(`userPhoto/${user.uid}`).getDownloadURL()
        )
        .then(url => {
          db.collection('users').doc(user.uid).update({
            displayName: name,
            photoURL: url
          })
          return user.updateProfile({
            displayName: name,
            photoURL: url
          })
        })
        .then(() => user.updateEmail(email))
        .then(() =>
          db.collection('users').doc(user.uid).update({
            email
          })
        )
        .then(() => {
          console.log('Account updated')
          this.context.auth.updateAccount(
            user.displayName,
            user.email,
            user.photoURL
          )
          this.setState({ file: null, loading: false, success: true })
        })
        .catch(e => {
          NotificationManager.error(e.message)
          this.setState({ loading: false })
        })

    !file &&
      user
        .updateProfile({
          displayName: name
        })
        .then(() =>
          db.collection('users').doc(user.uid).update({
            displayName: name
          })
        )
        .then(() => user.updateEmail(email))
        .then(() =>
          db.collection('users').doc(user.uid).update({
            email
          })
        )
        .then(() => {
          console.log('Account updated')
          this.context.auth.updateAccount(
            user.displayName,
            user.email,
            user.photoURL
          )
          this.setState({ loading: false, success: true })
        })
        .catch(e => NotificationManager.error(e.message))
  }

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }))
  }

  handleClickShowConfirmPassword = () => {
    this.setState(state => ({
      showConfirmPassword: !state.showConfirmPassword
    }))
  }

  changePass = () => {
    const user = auth.currentUser
    this.setState({ loading: true })

    user
      .updatePassword(this.state.password)
      .then(() => {
        console.log('Password updated')
        this.setState({ success: true, pass: false, loading: false })
      })
      .catch(e => {
        NotificationManager.error(e.message)
        this.setState({ loading: false })
      })
  }

  render () {
    const {
      file,
      warning,
      loading,
      pass,
      password,
      confirmPassword,
      showPassword,
      showConfirmPassword,
      success
    } = this.state
    const { authUser, showMessage, alertMessage } = this.context.auth

    return (
      <div className='app-wrapper'>
        <div className='dashboard animated slideInUpTiny animation-duration-3'>
          <ContainerHeader
            match={this.props.match}
            title={<IntlMessages id='popup.setting' />}
          />
          <Card>
            <CardContent>
              <div className='container'>
                <div className='row'>
                  <div className='col-3 align-self-end'>
                    <h3>
                      <IntlMessages id='settings.changeName' />:
                    </h3>
                  </div>
                  <div className='col'>
                    <TextField
                      type='text'
                      label='Name'
                      onChange={event =>
                        this.setState({ name: event.target.value })}
                      fullWidth
                      defaultValue={authUser.displayName}
                      margin='normal'
                      className='mt-0 mb-2'
                    />
                  </div>
                </div>
                <div className='row'>
                  <div className='col-3 align-self-end'>
                    <h3>
                      <IntlMessages id='settings.changeEmail' />:
                    </h3>
                  </div>
                  <div className='col'>
                    <TextField
                      type='email'
                      onChange={event =>
                        this.setState({ email: event.target.value })}
                      label={<IntlMessages id='appModule.email' />}
                      fullWidth
                      defaultValue={authUser.email}
                      margin='normal'
                      className='mt-0 mb-2'
                    />
                  </div>
                </div>
                <div className='row'>
                  <div className='col-3 align-self-end'>
                    <h4>
                      <IntlMessages id='settings.emailVerified' />:
                    </h4>
                  </div>
                  <div className='col'>
                    <Switch
                      checked={authUser.emailVerified}
                      value='verified'
                      color='primary'
                    />
                  </div>
                </div>
                <div className='row'>
                  <div className='col-3  align-self-center'>
                    <h4>
                      <IntlMessages id='settings.changePhoto' />:
                    </h4>
                  </div>
                  <div className='col'>
                    <div className='dropzone-card'>
                      <div className='dropzone'>
                        <Dropzone
                          accept='image/jpeg, image/png'
                          onDrop={(accepted, rejected) => {
                            this.setState({ file: accepted[0] })
                          }}
                        >
                          {file
                            ? <img
                              src={file.preview}
                              alt='preview'
                              style={{ height: '150px' }}
                              />
                            : <Fragment>
                              <p>
                                  Try dropping some files here, or click to select
                                  files to upload.
                                </p>
                              <p className='mb-0'>
                                  Only *.jpeg and *.png images will be accepted
                                </p>
                            </Fragment>}
                        </Dropzone>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-5 align-self-center'>
                    <h4>
                      <IntlMessages id='settings.changePass' />:
                    </h4>
                  </div>
                  <div className='col'>
                    <Button
                      variant='contained'
                      size='small'
                      color='default'
                      className='m-2'
                      onClick={this.togglePass}
                    >
                      <IntlMessages id='settings.updatePass' />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardActions>
              <div className='mx-auto'>
                <Button
                  variant='contained'
                  size='small'
                  color='secondary'
                  className='m-2'
                  onClick={this.toggleWarning}
                >
                  <IntlMessages id='settings.deleteAccount' />
                </Button>
                <Button
                  variant='contained'
                  size='small'
                  color='primary'
                  className='m-2'
                  onClick={this.updateAccount}
                  disabled={loading}
                >
                  <IntlMessages id='settings.updateAccount' />
                  {loading &&
                    <CircularProgress
                      size={24}
                      className='text-green position-absolute'
                    />}
                </Button>
              </div>
            </CardActions>
          </Card>

          <SweetAlert
            show={warning}
            warning
            showCancel
            confirmBtnText={<IntlMessages id='sweetAlerts.yesDeleteIt' />}
            confirmBtnBsStyle='danger'
            cancelBtnBsStyle='default'
            title={<IntlMessages id='sweetAlerts.areYouSure' />}
            onConfirm={this.deleteAccount}
            onCancel={this.toggleWarning}
          >
            <IntlMessages id='sweetAlerts.youWillNotAble' />
          </SweetAlert>

          <Dialog open={pass} onClose={this.togglePass}>
            <DialogTitle>
              <IntlMessages id='setting.dialog.pass' />
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                <IntlMessages id='setting.dialog.passText' />
              </DialogContentText>
              <FormControl fullWidth>
                <InputLabel htmlFor='password'>
                  <IntlMessages id='setting.dialog.passInput' />
                </InputLabel>
                <Input
                  id='password'
                  type={this.state.showPassword ? 'text' : 'password'}
                  value={password}
                  name='password'
                  onChange={e =>
                    this.setState({ [e.target.name]: e.target.value })}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        aria-label='Toggle password visibility'
                        onClick={this.handleClickShowPassword}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              <FormControl fullWidth>
                <InputLabel htmlFor='confirmPassword'>
                  <IntlMessages id='setting.dialog.confirmPassInput' />
                </InputLabel>
                <Input
                  id='confirmPassword'
                  type={this.state.showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  name='confirmPassword'
                  onChange={e =>
                    this.setState({ [e.target.name]: e.target.value })}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        aria-label='Toggle confirm password visibility'
                        onClick={this.handleClickShowConfirmPassword}
                      >
                        {showConfirmPassword
                          ? <VisibilityOff />
                          : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.togglePass} color='secondary'>
                <IntlMessages id='dialog.cancel' />
              </Button>
              <Button
                onClick={this.changePass}
                color='primary'
                disabled={password.length >= 8 && password !== confirmPassword}
              >
                {!loading
                  ? <IntlMessages id='dialog.confirm' />
                  : <CircularProgress size={18} style={{ color: 'green' }} />}
              </Button>
            </DialogActions>
          </Dialog>

          <SweetAlert
            show={success}
            success
            title={<IntlMessages id='sweetAlerts.goodJob' />}
            onConfirm={() => this.setState({ success: false })}
          >
            <IntlMessages id='sweetAlerts.accountUpdated' />
          </SweetAlert>
        </div>
        {showMessage && NotificationManager.error(alertMessage)}
      </div>
    )
  }
}

export default Settings
