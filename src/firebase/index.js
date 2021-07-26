import firebase from 'firebase/app';
import "firebase/storage";


const firebaseConfig = {

};

const storage = firebase.storage;

firebase.initializeApp(firebaseConfig);

export { storage, firebase as default };