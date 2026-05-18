import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {

  apiKey: "AIzaSyDmOzEfXJbB8CXCvl4UpV0uF-0w4aHVTGw",

  authDomain: "foodtruck-pos-2e3d6.firebaseapp.com",

  projectId: "foodtruck-pos-2e3d6",

  storageBucket: "foodtruck-pos-2e3d6.firebasestorage.app",

  messagingSenderId: "13035774283",

  appId: "1:13035774283:web:f5adff9edcbfee9b9cc8ce",

  measurementId: "G-CKYEDW8TWJ"

};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);