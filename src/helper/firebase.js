import firebase from "firebase";

// Initialize Firebase
const config = {
  apiKey: "AIzaSyAOIrQOp6zRzCCyZTKou89Fm7gvL5Te8p4",
  authDomain: "jumbo-react-2e67a.firebaseapp.com",
  databaseURL: "https://jumbo-react-2e67a.firebaseio.com",
  projectId: "jumbo-react-2e67a",
  storageBucket: "jumbo-react-2e67a.appspot.com",
  messagingSenderId: "409276958835"
};

firebase.initializeApp(config);
const auth = firebase.auth();

const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
const githubAuthProvider = new firebase.auth.GithubAuthProvider();
const twitterAuthProvider = new firebase.auth.TwitterAuthProvider();

const database = firebase.database();
const firestore = firebase.firestore();
export {
  auth,
  database,
  firestore,
  googleAuthProvider,
  githubAuthProvider,
  facebookAuthProvider,
  twitterAuthProvider
};