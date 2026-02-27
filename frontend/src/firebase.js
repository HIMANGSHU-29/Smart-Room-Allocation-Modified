import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyApNZX0T9A8ucSxlKPpUXWCqRBE2YeTPPI",
    authDomain: "allocateu-dab0d.firebaseapp.com",
    projectId: "allocateu-dab0d",
    storageBucket: "allocateu-dab0d.firebasestorage.app",
    messagingSenderId: "221262923760",
    appId: "1:221262923760:web:1e155b965764e53adc7f35",
    measurementId: "G-NP0BQJVB7X"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
