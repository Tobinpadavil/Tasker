// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9mL4H2nEbaSWKZfAH8S9Z8II6iyBOAHU",
  authDomain: "tasker-74922.firebaseapp.com",
  projectId: "tasker-74922",
  storageBucket: "tasker-74922.appspot.com",
  messagingSenderId: "681525705441",
  appId: "1:681525705441:web:4d08df582ad899c5ca95a0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

const ViewLoggedOutView = document.getElementById("logged-out-view");
const ViewLoggedInView = document.getElementById("logged-in-view");

const signup = document.getElementById("signup");
const signin = document.getElementById("signin");
const logout = document.getElementById("logout");
const Google = document.getElementById("google");

signup.addEventListener("click", signUpUser);
signin.addEventListener("click", signInUser);
logout.addEventListener("click", logOutUser);
Google.addEventListener("click", authSignInWithGoogle);

function signUpUser() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("Account created");
      window.location.reload(); // Reload the page to check auth state
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
}

function signInUser() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("Signed in");
      window.location.reload(); // Reload the page to check auth state
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
}

function logOutUser() {
  signOut(auth)
    .then(() => {
      alert("Signed out");
      window.location.reload(); // Reload the page to check auth state
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    viewLoggedInView();
    loadUserTodos(user);
  } else {
    viewLoggedOutView();
  }
});

function viewLoggedInView() {
  showView(ViewLoggedInView);
  hideView(ViewLoggedOutView);
}

function viewLoggedOutView() {
  showView(ViewLoggedOutView);
  hideView(ViewLoggedInView);
}

function hideView(view) {
  view.style.display = "none";
}

function showView(view) {
  view.style.display = "block";
}

function authSignInWithGoogle() {
  signInWithPopup(auth, provider)
    .then((result) => {
      alert("Signed in with Google");
      window.location.reload(); // Reload the page to check auth state
    })
    .catch((error) => {
      console.error(error.message);
    });
}

// SECTION 2

document.addEventListener('DOMContentLoaded', () => {
  const btnEL = document.getElementById('btn-el');
  btnEL.addEventListener('click', () => addTodo(auth.currentUser));
});

async function addTodo(user) {
  const inputEL = document.getElementById('todo-input-el');
  const todoText = inputEL.value.trim();
  if (todoText !== '' && user) {
    const userDoc = doc(db, 'users', user.displayName);
    const todoRef = doc(collection(userDoc, 'todos'));
    await setDoc(todoRef, {
      text: todoText,
      completed: false,
      timestamp: new Date()
    });
    inputEL.value = '';
  }
}

function loadUserTodos(user) {
  const ulEL = document.getElementById('ul-el');
  if (!user) return;

  const userDoc = doc(db, 'users', user.displayName);
  const q = collection(userDoc, 'todos');
  onSnapshot(q, (querySnapshot) => {
    ulEL.innerHTML = '';
    querySnapshot.forEach((doc) => {
      const todo = doc.data();
      const li = document.createElement('li');
      li.textContent = todo.text;
      if (todo.completed) {
        li.style.textDecoration = 'line-through';
      }
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'checkbox';
      checkbox.checked = todo.completed;
      checkbox.addEventListener('change', () => toggleComplete(user, doc.id, checkbox.checked));

      li.appendChild(checkbox);
      ulEL.appendChild(li);
    });
  });
}

async function toggleComplete(user, todoId, completed) {
  const userDoc = doc(db, 'users', user.displayName);
  const todoRef = doc(userDoc, 'todos', todoId);
  await updateDoc(todoRef, {
    completed: completed
  });
}
