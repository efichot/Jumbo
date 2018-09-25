"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
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
        .add(Object.assign({}, snap.data(), { id: context.params.todoID }))
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
        emailVerified: user.emailVerified,
        notifications: [],
        messages: [],
        mood: "it's a status....not your diary...",
        contacts: []
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
//# sourceMappingURL=index.js.map