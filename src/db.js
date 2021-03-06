import firebase from 'firebase';

class Database {
    constructor() {
        if (process.env.REACT_APP_FIREBASE_API_KEY) {
            const config = {
                apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
                authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
                databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
                projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
                storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
                messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
                appId: process.env.REACT_APP_FIREBASE_APP_ID,
                measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
            };
            if (!firebase.apps.length) {
                firebase.initializeApp(config);
            }
        } else {
            console.log("No Firebase config found!");
        }
    }

    saveWord(word) {
        const db = firebase.firestore();
        return db.collection("articles").add(word);
    }

    searchWords(lookup) {
        const db = firebase.firestore();
        return db.collection('articles').orderBy('word').startAt(lookup).endAt(lookup + '\uf8ff');
    }

    fetchUserAdmin(user, setAdminCallback) {
        const db = firebase.firestore();
        db.collection("users").doc(user.email).get().then(function (doc) {
            if (doc.exists) {
                setAdminCallback(doc.data().admin);
            } else {
                db.collection("users").doc(user.email).set(
                    {
                        admin: false,
                        moderator: false
                    }
                ).then(
                    result => setAdminCallback(false)
                )
            }
        })
    }
}

export default Database;