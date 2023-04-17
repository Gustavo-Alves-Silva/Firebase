import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyDBWtZekENVqomsxsF8Mh9arbbgUoRp6-A",
    authDomain: "curso-d94ce.firebaseapp.com",
    projectId: "curso-d94ce",
    storageBucket: "curso-d94ce.appspot.com",
    messagingSenderId: "790470934547",
    appId: "1:790470934547:web:ae684281cc96e567b97fe6",
    measurementId: "G-0P7FZN1JZQ"
  };

  const firebaseApp = initializeApp(firebaseConfig);

  const db = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp)

  export { db, auth };