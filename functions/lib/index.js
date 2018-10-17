"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const algoliasearch = require("algoliasearch");
const apollo_server_express_1 = require("apollo-server-express");
/////////* Admin SDK config */////////////
admin.initializeApp();
const env = functions.config();
const db = admin.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);
/////////* Algolia config *///////////////
const client = algoliasearch(env.algolia.appid, env.algolia.apikey);
const index = client.initIndex('jumbo');
/////////* EXPRESS config */////////////
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ origin: true }));
/////////* EXPRESS EndPoints */////////////
app.get('/hello', (req, res) => {
    res.send('Hello from firebase!');
});
/////////* APOLLO SERVER */////////////
const typeDefs = apollo_server_express_1.gql `
  type Book {
    auteurId: ID!
    id: ID!
    title: String!
    auteur: Auteur!
  }

  type Auteur {
    id: ID!
    name: String!
    books: [Book]
  }

  type Query {
    books: [Book]!
    auteur(name: String!): Auteur
  }
`;
const resolvers = {
    Book: {
        auteur(book) {
            return db
                .collection('auteurs')
                .doc(book.auteurId)
                .get()
                .then(doc => doc.data())
                .catch(e => console.log(e));
        }
    },
    Auteur: {
        books(user) {
            return db
                .collection('books')
                .where('auteurId', '==', user.id)
                .get()
                .then(docs => docs.docs.map(doc => doc.data()))
                .catch(e => console.log(e));
        }
    },
    Query: {
        books() {
            return db
                .collection('books')
                .get()
                .then(docs => docs.docs.map(doc => {
                console.log(doc.data());
                return doc.data();
            }))
                .catch(e => console.log(e));
        },
        auteur(_, args) {
            return db
                .collection('auteurs')
                .where('name', '==', args.name)
                .get()
                .then(docs => docs.docs[0].data())
                .catch(e => console.log(e));
        }
    }
};
const server = new apollo_server_express_1.ApolloServer({
    typeDefs,
    resolvers
});
server.applyMiddleware({ app, path: '/' });
const api = functions.https.onRequest(app);
/////////* CALLABLE FUNCTIONS */////////////
const subscribeToTopic = functions.https.onCall((data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated');
    }
    const { token, topic } = data;
    return admin
        .messaging()
        .subscribeToTopic(token, topic)
        .then(() => {
        console.log(`Subscribe to topic:${topic}`);
        return { done: true, message: `Subscribe to topic:${topic}` };
    })
        .catch(e => {
        console.log(e);
        return { done: false, message: e };
    });
});
const unsubscribeFromTopic = functions.https.onCall((data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated');
    }
    const { token, topic } = data;
    return admin
        .messaging()
        .unsubscribeFromTopic(token, topic)
        .then(() => {
        console.log(`Unsubscribe from topic:${topic}`);
        return { done: true, message: `Subscribe to topic:${topic}` };
    })
        .catch(e => {
        console.log(e);
        return { done: false, message: e };
    });
});
const sendPushMessageToTopic = functions.https.onCall((data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated');
    }
    const { topic } = data;
    const notification = {
        title: 'Notification push',
        body: `Notif push for the topic: ${topic} 😍`
    };
    const payload = {
        notification,
        webpush: {
            notification: {
                vibrate: [200, 100, 200],
                icon: 'http://icons.iconarchive.com/icons/cjdowner/cryptocurrency/512/IOTA-icon.png',
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
        .then(() => {
        console.log('Notification push send!');
        return { done: true, message: `Notification push send!` };
    })
        .catch(e => {
        console.log(e);
        return { done: false, message: e };
    });
});
/////////* FIRESTORE Functions */////////////
const addTodo = functions.firestore
    .document('todos/{todoId}')
    .onCreate((snap, context) => {
    // add document to algolia
    return index.addObject(Object.assign({}, snap.data(), { objectID: snap.id }));
});
const deleteTodo = functions.firestore
    .document('todos/{todoId}')
    .onDelete((snap, context) => {
    // delete from algolia
    index.deleteObject(snap.id);
    db.collection('trash')
        .add(Object.assign({}, snap.data(), { id: context.params.todoId }))
        .then(docRef => {
        console.log(`Todo ${docRef.id} deleted, and add to the trash collection`);
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
    deleteTodo,
    addTodo,
    subscribeToTopic,
    unsubscribeFromTopic,
    sendPushMessageToTopic
};
//# sourceMappingURL=index.js.map