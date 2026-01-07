import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";

/**
 * CONFIGURAÇÃO DO FIREBASE
 */
const firebaseConfig = {
  apiKey: "AIzaSyDbrm18dtCMRja5oBa3meeKW9eK7hL7hAE",
  authDomain: "my-finance-app-7228f.firebaseapp.com",
  projectId: "my-finance-app-7228f",
  storageBucket: "my-finance-app-7228f.firebasestorage.app",
  messagingSenderId: "137430341026",
  appId: "1:137430341026:web:1e6ea8d7c5d5e5c09bcefb",
  measurementId: "G-KGPW6LK14R"
};

// Inicializa o Firebase com tratamento de erro
let app;
let db;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (error) {
  console.error("Erro ao inicializar Firebase:", error);
}

export { db };
export { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, query, orderBy };
