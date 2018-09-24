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

app.get('/listUsers', (req, res) => {
  admin
    .auth()
    .listUsers(1000)
    .then(listUsersResult => {
      listUsersResult.users.forEach(userRecord => {
        console.log('user', userRecord.toJSON());
      });
    })
    .catch(error => {
      console.log('Error listing users:', error);
    });
});

const api = functions.https.onRequest(app);

/////////* FIRESTORE Functions */////////////

const createTask = functions.firestore
  .document('todos/{todoID}')
  .onCreate((snap, context) => {
    db.doc(`todos/${context.params.todoID}`)
      .update({
        newField: 'test'
      })
      .then(() => console.log('newField added properly!'))
      .catch(e => console.log(e));
  });

const deleteTask = functions.firestore
  .document('todos/{todoID}')
  .onDelete((snap, context) => {
    db.collection('trash')
      .add({
        ...snap.data(),
        id: context.params.todoID
      })
      .then(() => console.log('Task added to the trash collection'))
      .catch(e => console.log(e));
  });

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
      mood: "it's a status....not your diary..."
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
  createTask,
  deleteTask,
  userCreate,
  userDelete
};
