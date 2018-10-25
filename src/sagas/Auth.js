import { call, put, takeEvery } from 'redux-saga/effects'
import {
  auth,
  db,
  facebookAuthProvider,
  githubAuthProvider,
  googleAuthProvider,
  twitterAuthProvider
} from 'helper/firebase'
import {
  SIGNIN_FACEBOOK_USER,
  SIGNIN_GITHUB_USER,
  SIGNIN_GOOGLE_USER,
  SIGNIN_TWITTER_USER,
  SIGNIN_USER,
  SIGNOUT_USER,
  SIGNUP_USER,
  RESET_PASS
} from 'constants/ActionTypes'
import {
  showAuthMessage,
  userSignOutSuccess,
  userSendMailSuccess,
  userSignInSuccess
} from 'actions/Auth'

const createUserWithEmailPasswordRequest = async (email, password, name) =>
  await auth
    .createUserWithEmailAndPassword(email, password)
    .then(authUser => authUser)
    .catch(error => error)

const updateDisplayName = async (name, user) =>
  await user
    .updateProfile({
      displayName: name
    })
    .then(() => console.log('DisplayName updated'))
    .catch(error => error)

const updateDisplayNameAndStateDB = async (name, uid) =>
  await db
    .collection('users')
    .doc(uid)
    .update({
      displayName: name,
      status: 'online'
    })
    .then(() => console.log('DisplayName updated in db'))
    .catch(error => error)

const offlineState = async () =>
  await db.collection('users').doc(auth.currentUser.uid).update({
    status: 'offline'
  })

const sendEmailVerification = async user =>
  await user
    .sendEmailVerification()
    .then(() => console.log('email verification sent to user'))
    .catch(error => error)

const signInUserWithEmailPasswordRequest = async (email, password) =>
  await auth
    .signInWithEmailAndPassword(email, password)
    .then(authUser => authUser)
    .catch(error => error)

const signOutRequest = async () =>
  await auth.signOut().then(authUser => authUser).catch(error => error)

const signInUserWithGoogleRequest = async () =>
  await auth
    .signInWithPopup(googleAuthProvider)
    .then(authUser => authUser)
    .catch(error => error)

const signInUserWithFacebookRequest = async () =>
  await auth
    .signInWithPopup(facebookAuthProvider)
    .then(authUser => authUser)
    .catch(error => error)

const signInUserWithGithubRequest = async () =>
  await auth
    .signInWithPopup(githubAuthProvider)
    .then(authUser => authUser)
    .catch(error => error)

const signInUserWithTwitterRequest = async () =>
  await auth
    .signInWithPopup(twitterAuthProvider)
    .then(authUser => authUser)
    .catch(error => error)

const sendMail = async email =>
  await auth
    .sendPasswordResetEmail(email)
    .then(() => console.log('Email sent'))
    .catch(error => error)

function * createUserWithEmailPassword ({ payload }) {
  const { email, password, name } = payload
  try {
    const signUpUser = yield call(
      createUserWithEmailPasswordRequest,
      email,
      password
    )
    if (signUpUser.message) {
      yield put(showAuthMessage(signUpUser.message))
    } else {
      yield call(updateDisplayName, name, signUpUser.user)
      yield call(updateDisplayNameAndStateDB, name, signUpUser.user.uid)
      yield call(sendEmailVerification, signUpUser.user)
      yield put(userSignInSuccess(signUpUser.user))
    }
  } catch (error) {
    yield put(showAuthMessage(error))
  }
}

function * signInUserWithGoogle () {
  try {
    const signUpUser = yield call(signInUserWithGoogleRequest)
    if (signUpUser.message) {
      yield put(showAuthMessage(signUpUser.message))
    }
  } catch (error) {
    yield put(showAuthMessage(error))
  }
}

function * signInUserWithFacebook () {
  try {
    const signUpUser = yield call(signInUserWithFacebookRequest)
    if (signUpUser.message) {
      yield put(showAuthMessage(signUpUser.message))
    }
  } catch (error) {
    yield put(showAuthMessage(error))
  }
}

function * signInUserWithGithub () {
  try {
    const signUpUser = yield call(signInUserWithGithubRequest)
    if (signUpUser.message) {
      yield put(showAuthMessage(signUpUser.message))
    }
  } catch (error) {
    yield put(showAuthMessage(error))
  }
}

function * signInUserWithTwitter () {
  try {
    const signUpUser = yield call(signInUserWithTwitterRequest)
    if (signUpUser.message) {
      if (signUpUser.message.length > 100) {
        yield put(showAuthMessage('Your request has been canceled.'))
      } else {
        yield put(showAuthMessage(signUpUser.message))
      }
    }
  } catch (error) {
    yield put(showAuthMessage(error))
  }
}

function * signInUserWithEmailPassword ({ payload }) {
  const { email, password } = payload
  try {
    const signInUser = yield call(
      signInUserWithEmailPasswordRequest,
      email,
      password
    )
    if (signInUser.message) {
      yield put(showAuthMessage(signInUser.message))
    }
  } catch (error) {
    yield put(showAuthMessage(error))
  }
}

function * signOut () {
  try {
    yield call(offlineState)
    const signOutUser = yield call(signOutRequest)
    if (signOutUser === undefined) {
      yield put(userSignOutSuccess(signOutUser))
    } else {
      yield put(showAuthMessage(signOutUser.message))
    }
  } catch (error) {
    yield put(showAuthMessage(error))
  }
}

function * resetPass ({ payload }) {
  const { email } = payload
  const error = yield call(sendMail, email)
  if (error) {
    yield put(showAuthMessage(error.message))
  } else {
    yield put(userSendMailSuccess())
  }
}

export default function * rootSaga () {
  yield [
    takeEvery(SIGNUP_USER, createUserWithEmailPassword),
    takeEvery(SIGNIN_GOOGLE_USER, signInUserWithGoogle),
    takeEvery(SIGNIN_FACEBOOK_USER, signInUserWithFacebook),
    takeEvery(SIGNIN_TWITTER_USER, signInUserWithTwitter),
    takeEvery(SIGNIN_GITHUB_USER, signInUserWithGithub),
    takeEvery(SIGNIN_USER, signInUserWithEmailPassword),
    takeEvery(SIGNOUT_USER, signOut),
    takeEvery(RESET_PASS, resetPass)
  ]
}
