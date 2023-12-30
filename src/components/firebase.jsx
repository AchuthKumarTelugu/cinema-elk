

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCZOQaoBB1NHOumuHrrjz9P2mRwmdqfa5I",
  authDomain: "fir-react-13967.firebaseapp.com",
  projectId: "fir-react-13967",
  storageBucket: "fir-react-13967.appspot.com",
  messagingSenderId: "404946560070",
  appId: "1:404946560070:web:14b7fa0daec1bfaebed647"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db=getFirestore(app)