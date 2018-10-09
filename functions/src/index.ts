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

app.post('/subscribeToTopic', (req, res) => {
  const { token, topic } = req.body;
  admin
    .messaging()
    .subscribeToTopic(token, topic)
    .then(() => {
      console.log(`Subscribe to topic:${topic}`);
      res.send({ done: true, message: `Subscribe to topic:${topic}` });
    })
    .catch(e => {
      console.log(e);
      res.send({ done: false, message: e });
    });
});

app.post('/UnsubscribeFromTopic', (req, res) => {
  const { token, topic } = req.body;
  admin
    .messaging()
    .unsubscribeFromTopic(token, topic)
    .then(() => {
      console.log(`Unsubscribe from topic:${topic}`);
      res.send({ done: true, message: `Subscribe to topic:${topic}` });
    })
    .catch(e => {
      console.log(e);
      res.send({ done: false, message: e });
    });
});

app.post('/sendPushMessageToTopic', (req, res) => {
  const { topic } = req.body;

  const notification: admin.messaging.Notification = {
    title: 'Notification push',
    body: `Notif push for the topic: ${topic} 😍`
  };
  const payload: admin.messaging.Message = {
    notification,
    webpush: {
      notification: {
        vibrate: [200, 100, 200],
        icon:
          'http://icons.iconarchive.com/icons/cjdowner/cryptocurrency/512/IOTA-icon.png',
        actions: [
          {
            action: 'like',
            title: 'Like 😍'
          }
        ]
      }
    },
    topic: topic
  };
  return admin
    .messaging()
    .send(payload)
    .then(() => console.log('Notification push send!'))
    .catch(e => console.log(e));
});

const api = functions.https.onRequest(app);

/////////* FIRESTORE Functions */////////////

const deleteTodo = functions.firestore
  .document('todos/{todoId}')
  .onDelete((snap, context) => {
    db.collection('trash')
      .add({
        ...snap.data(),
        id: context.params.todoId
      })
      .then(docRef => {
        console.log(
          `Todo ${docRef.id} deleted, and add to the trash collection`
        );
      })
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
      messages: {},
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
  userDelete,
  deleteTodo
};
