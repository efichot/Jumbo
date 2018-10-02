import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

/////////* DB config */////////////

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);

/////////* EXPRESS config */////////////

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ origin: true }));

/////////* EXPRESS EndPoints */////////////

app.get('/test', (req, res) => {
  res.send('Hello from firebase cloud functions!');
});

const api = functions.https.onRequest(app);

/////////* FIRESTORE Functions */////////////

//////////* AUTH Functions */////////////////

const userCreate = functions.auth.user().onCreate(user => {
  db.collection('users')
    .doc(user.uid)
    .set({
      displayName: user.displayName,
      photoURL: user.photoURL,
      email: user.email,
      notifications: [],
      messages: [],
      mood: "it's a status....not your diary...",
      contacts: [],
      chats: {}
    })
    .then(() => console.log('User added to the users collection'))
    .catch(e => console.log(e));
});

const userDelete = functions.auth.user().onDelete(user => {
  db.collection('users')
    .doc(user.uid)
    .delete()
    .then(() => console.log('User deleted to the users collection'))
    .catch(e => console.log(e));
});

module.exports = {
  api,
  userCreate,
  userDelete
};
