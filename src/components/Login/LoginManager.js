import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';


export const initializeLoginFramework = () => {
    // firebase.initializeApp(firebaseConfig);
    !firebase.apps.length && firebase.initializeApp(firebaseConfig);
}

export const handleGoogleSingIn = () => {
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithPopup(googleProvider)
        .then(res => {
            const { displayName, email, photoURL } = res.user;

            const signedInUser = {
                isSingIn: true,
                name: displayName,
                email: email,
                photo: photoURL,
                success: true
            }
            return signedInUser;
        })
        .catch(error => {
            console.log(error);
            console.log(error.message);
        })
}

export const handleFbSingIn = () => {
    var fbProvider = new firebase.auth.FacebookAuthProvider();
    return firebase
        .auth()
        .signInWithPopup(fbProvider)
        .then((result) => {
            var user = result.user;
            user.success = true;
            return user;
        })
        .catch((error) => {
            var errorMessage = error.message;
            console.log(errorMessage);
        });
}

export const handleSingOut = () => {
    return firebase.auth().signOut()
        .then(res => {
            const signedOutUser = {
                isSingIn: false,
                name: '',
                email: '',
                photo: '',
                error: '',
                success: false
            }
            return signedOutUser;
        })
        .catch(error => {
            console.log(error.message);
        })
}

export const createUserWithEmailAndPassword = (name, email, password) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(res => {
            const newUserInfo = res.user;
            newUserInfo.error = '';
            newUserInfo.success = true;
            updateUserInfo(name);
            return newUserInfo;
        })
        .catch((error) => {
            const newUserInfo = {};
            newUserInfo.error = error.message;
            newUserInfo.success = false;
            return newUserInfo;
        });
}

export const signInWithEmailAndPassword = (email, password) => {
    return firebase.auth().signInWithEmailAndPassword(email, password)
        .then((res) => {
            const newUserInfo = res.user;
            newUserInfo.error = '';
            newUserInfo.success = true;
            return newUserInfo;
        })
        .catch((error) => {
            const newUserInfo = {};
            newUserInfo.error = error.message;
            newUserInfo.success = false;
            return newUserInfo;
        });
}

const updateUserInfo = name => {
    var user = firebase.auth().currentUser;

    user.updateProfile({
        displayName: name
    }).then(function () {
        console.log('user name update');
    }).catch(function (error) {
        console.log(error);
    });
}