import {
  HIDE_MESSAGE,
  INIT_URL,
  ON_HIDE_LOADER,
  ON_SHOW_LOADER,
  SHOW_MESSAGE,
  SIGNIN_USER_SUCCESS,
  SIGNOUT_USER_SUCCESS,
  USER_SEND_MAIL_SUCCESS,
  UPDATE_ACCOUNT
} from 'constants/ActionTypes';

const INIT_STATE = {
  loader: false,
  alertMessage: '',
  showMessage: false,
  initURL: '',
  authUser: null,
  successMessage: ''
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case SIGNIN_USER_SUCCESS: {
      return {
        ...state,
        loader: false,
        authUser: {
          email: action.payload.email,
          displayName: action.payload.displayName,
          phoneNumber: action.payload.phoneNumber,
          photoURL: action.payload.photoURL,
          emailVerified: action.payload.emailVerified
        }
      };
    }
    case INIT_URL: {
      return {
        ...state,
        initURL: action.payload
      };
    }
    case SIGNOUT_USER_SUCCESS: {
      return {
        ...state,
        authUser: null,
        initURL: '/app/dashboard',
        loader: false
      };
    }

    case SHOW_MESSAGE: {
      return {
        ...state,
        alertMessage: action.payload,
        showMessage: true,
        loader: false
      };
    }
    case HIDE_MESSAGE: {
      return {
        ...state,
        alertMessage: '',
        successMessage: '',
        showMessage: false,
        loader: false
      };
    }
    case ON_SHOW_LOADER: {
      return {
        ...state,
        loader: true
      };
    }
    case ON_HIDE_LOADER: {
      return {
        ...state,
        loader: false
      };
    }
    case USER_SEND_MAIL_SUCCESS: {
      return {
        ...state,
        loader: false,
        successMessage: 'Check your emails',
        showMessage: true,
        alertMessage: ''
      };
    }
    case UPDATE_ACCOUNT: {
      return {
        ...state,
        authUser: {
          ...state.authUser,
          displayName: action.payload.name,
          email: action.payload.email,
          photoURL: action.payload.photoURL
        }
      };
    }
    default:
      return state;
  }
};
