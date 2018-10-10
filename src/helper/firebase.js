import firebase from 'firebase/app';
import { NotificationManager } from 'react-notifications';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';
import 'firebase/messaging';
import 'firebase/functions';

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyAOIrQOp6zRzCCyZTKou89Fm7gvL5Te8p4',
  authDomain: 'jumbo-react-2e67a.firebaseapp.com',
  databaseURL: 'https://jumbo-react-2e67a.firebaseio.com',
  projectId: 'jumbo-react-2e67a',
  storageBucket: 'jumbo-react-2e67a.appspot.com',
  messagingSenderId: '409276958835'
};

firebase.initializeApp(config);
const auth = firebase.auth();
const storage = firebase.storage();
const functions = firebase.functions();

const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
const githubAuthProvider = new firebase.auth.GithubAuthProvider();
const twitterAuthProvider = new firebase.auth.TwitterAuthProvider();

const db = firebase.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);

// FCM
const messaging = firebase.messaging();

messaging
  .requestPermission()
  .then(() => {
    console.log('Have Permission');
    return messaging.getToken();
  })
  .then(token => {
    console.log(token);
  })
  .catch(console.log('Error Occured'));

messaging.onMessage(function(payload) {
  console.log('Message received. ', payload);
  NotificationManager.info(payload.notification.body);
});

export {
  firebase,
  db,
  auth,
  storage,
  messaging,
  functions,
  googleAuthProvider,
  githubAuthProvider,
  facebookAuthProvider,
  twitterAuthProvider
};
