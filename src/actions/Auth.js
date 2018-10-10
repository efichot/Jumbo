import {
  HIDE_MESSAGE,
  INIT_URL,
  ON_HIDE_LOADER,
  ON_SHOW_LOADER,
  SHOW_MESSAGE,
  SIGNIN_FACEBOOK_USER,
  SIGNIN_GITHUB_USER,
  SIGNIN_GOOGLE_USER,
  SIGNIN_TWITTER_USER,
  SIGNIN_USER,
  SIGNIN_USER_SUCCESS,
  SIGNOUT_USER,
  SIGNOUT_USER_SUCCESS,
  SIGNUP_USER,
  RESET_PASS,
  USER_SEND_MAIL_SUCCESS,
  UPDATE_ACCOUNT,
  SAVE_TOKEN_FCM
} from 'constants/ActionTypes';

export const userSignUp = user => {
  return {
    type: SIGNUP_USER,
    payload: user
  };
};
export const userSignIn = user => {
  return {
    type: SIGNIN_USER,
    payload: user
  };
};
export const userSignOut = () => {
  return {
    type: SIGNOUT_USER
  };
};

export const userSignInSuccess = authUser => {
  return {
    type: SIGNIN_USER_SUCCESS,
    payload: authUser
  };
};

export const userSignOutSuccess = () => {
  return {
    type: SIGNOUT_USER_SUCCESS
  };
};

export const showAuthMessage = message => {
  return {
    type: SHOW_MESSAGE,
    payload: message
  };
};

export const userGoogleSignIn = () => {
  return {
    type: SIGNIN_GOOGLE_USER
  };
};

export const userFacebookSignIn = () => {
  return {
    type: SIGNIN_FACEBOOK_USER
  };
};

export const setInitUrl = url => {
  return {
    type: INIT_URL,
    payload: url
  };
};
export const userTwitterSignIn = () => {
  return {
    type: SIGNIN_TWITTER_USER
  };
};

export const userGithubSignIn = () => {
  return {
    type: SIGNIN_GITHUB_USER
  };
};

export const showAuthLoader = () => {
  return {
    type: ON_SHOW_LOADER
  };
};

export const hideMessage = () => {
  return {
    type: HIDE_MESSAGE
  };
};

export const hideAuthLoader = () => {
  return {
    type: ON_HIDE_LOADER
  };
};

export const resetPass = email => {
  return {
    type: RESET_PASS,
    payload: email
  };
};

export const userSendMailSuccess = email => {
  return {
    type: USER_SEND_MAIL_SUCCESS
  };
};

export const updateAccount = modif => {
  return {
    type: UPDATE_ACCOUNT,
    payload: modif
  };
};

export const saveTokenFCM = token => {
  return {
    type: SAVE_TOKEN_FCM,
    payload: token
  };
};
