// Import Firebase modules from their URLs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

// Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyD_XC-Y_jnBisrQ22NxHi49H3rQKegOXdQ",
    authDomain: "translator-f0e44.firebaseapp.com",
    projectId: "translator-f0e44",
    storageBucket: "translator-f0e44.appspot.com",
    messagingSenderId: "990078341844",
    appId: "1:990078341844:web:baae7701dbb6ca72d72141"
};

// Initialize Firebase with the configuration
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Authentication
const db = getFirestore(app);
const auth = getAuth(app);

// Execute code once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const MloginForm = document.querySelector('.lform');
    const MsignupForm = document.querySelector('.rform');
    const emailInputs = document.querySelectorAll('input[type="email"]');
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    const loggedInUserNameElement = document.getElementById('userName_display');
    const logoutButton = document.getElementById('logoutButton');
    const nameInput = document.getElementById('name-Input');

    // Event listener for authentication state changes
    auth.onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in, retrieve user data and display the name
            const uid = user.uid;

            // Retrieve the user's data from Firestore using their UID
            const userDocRef = doc(db, 'users', uid);
            getDoc(userDocRef)
                .then((docSnapshot) => {
                    if (docSnapshot.exists()) {
                        const userData = docSnapshot.data();
                        const userName = userData.name;

                        // Set the user's name in the HTML element
                        if (loggedInUserNameElement) {
                            loggedInUserNameElement.innerText = userName;
                        }
                        console.log('loggedInUserNameElement:', loggedInUserNameElement);
                        console.log('userName:', userName);
                    } else {
                        console.log('User document does not exist.......');
                    }
                })
                .catch((error) => {
                    console.error('Error retrieving user data from Firestore:', error);
                });
        }
    });

    // Event listener for the logout button
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            // Sign out the user from Firebase Authentication
            signOut(auth)
                .then(() => {
                    // User signed out successfully
                    console.log('User signed out');
                    window.location.href = '/index.html';
                })
                .catch((error) => {
                    console.error('Error signing out:', error.message);
                });
        });
    }

    // Code for login and signup forms
    if (MsignupForm) {
        MsignupForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = nameInput.value;
            const email = emailInputs[0].value;
            const password1 = passwordInputs[0].value;
            const password2 = passwordInputs[1].value;

            if (password1 !== password2) {
                alert('Passwords do not match');
                return;
            }

            // Create a new user with email and password
            createUserWithEmailAndPassword(auth, email, password1)
                .then((userCredential) => {
                    const user = userCredential.user;
                    console.log('Signed up user:', user);

                    // Store username in Firestore
                    const userDocRef = doc(db, 'users', user.uid);
                    const userData = {
                        name: name,
                        email: email,
                    };

                    // Set the user's data in Firestore
                    setDoc(userDocRef, userData)
                        .then(() => {
                            console.log('Username stored in Firestore');
                            window.location.href = '/index.html';
                        })
                        .catch((error) => {
                            console.error('Error storing username in Firestore:', error);
                        });
                    alert("Sign Up Is Successful........\n\nPlease Login To use our Services");
                })
                .catch((error) => {
                    if (error.message = 'Firebase: Error (auth/email-already-in-use).') {
                        alert("User Already Exists.....");
                    }
                });
        });
    }

    // Handle login form submission
    if (MloginForm) {
        MloginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = emailInputs[1].value;
            const password = passwordInputs[2].value;

            // Sign in with email and password
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    console.log('Signed in user:', user);
                    window.location.href = '/main.html';
                })
                .catch((error) => {
                    console.error('Error signing in:', error.message);
                    alert("Wrong Password.....");
                });
        });
    }
});
