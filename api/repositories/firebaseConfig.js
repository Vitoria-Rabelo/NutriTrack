const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyBZCSI-jruLCjxhQwq0T69OsFaerNx_OYk",
  authDomain: "nutritrack-37ea0.firebaseapp.com",
  projectId: "nutritrack-37ea0",
  storageBucket: "nutritrack-37ea0.firebasestorage.app",
  messagingSenderId: "239694002040",
  appId: "1:239694002040:web:4c234866e007e249187a8d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = db;