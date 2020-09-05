import firebase from 'firebase/app';
import 'firebase/firestore';


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA5ZsYlbNwbBloy5eXShB6AFO1KxifSFM8",
    authDomain: "lista-tareas-206b2.firebaseapp.com",
    databaseURL: "https://lista-tareas-206b2.firebaseio.com",
    projectId: "lista-tareas-206b2",
    storageBucket: "lista-tareas-206b2.appspot.com",
    messagingSenderId: "93445701556",
    appId: "1:93445701556:web:e2efe2b004b2ca8eec7ce1"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export {firebase};