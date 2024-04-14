import { initializeApp } from "firebase/app";
import {getFirestore }from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAj5ZqR2k_SXfQ-z3pt1woIAGWldI5U6l0",
  authDomain: "birthday-2785f.firebaseapp.com",
  projectId: "birthday-2785f",
  storageBucket: "birthday-2785f.appspot.com",
  messagingSenderId: "766503606047",
  appId: "1:766503606047:web:c66f97f4bb08d653d7422a",
  measurementId: "G-T5XTKX6922"
};
// eslint-disable-next-line
const app = initializeApp(firebaseConfig);

export const db = getFirestore()




