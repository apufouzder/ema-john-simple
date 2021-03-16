import './Login.css';
// import firebase from "firebase/app";
// import "firebase/auth";
// import firebaseConfig from './firebase.config';
import { useContext, useState } from 'react';
import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router';
import { createUserWithEmailAndPassword, handleFbSingIn, handleGoogleSingIn, handleSingOut, initializeLoginFramework, signInWithEmailAndPassword } from './LoginManager';


// firebase.initializeApp(firebaseConfig);
// !firebase.apps.length && firebase.initializeApp(firebaseConfig);

function Login() {
    initializeLoginFramework();

    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    const history = useHistory();
    const location = useLocation();
    let { from } = location.state || { from: { pathname: "/" } };


    // const googleProvider = new firebase.auth.GoogleAuthProvider();
    // var fbProvider = new firebase.auth.FacebookAuthProvider();

    const [newUser, setNewUser] = useState(false);
    const [user, setUser] = useState({
        isSingIn: false,
        name: '',
        email: '',
        password: '',
        success: false,
        error: '',
        photo: ''
    })

    // const handleGoogleSingIn = () => {
    //     firebase.auth().signInWithPopup(googleProvider)
    //         .then(res => {
    //             const { displayName, email, photoURL } = res.user;

    //             const signedInUser = {
    //                 isSingIn: true,
    //                 name: displayName,
    //                 email: email,
    //                 photo: photoURL
    //             }
    //             setUser(signedInUser);
    //             console.log(displayName, email, photoURL);
    //         })
    //         .catch(error => {
    //             console.log(error);
    //             console.log(error.message);
    //         })
    // }


    // const handleSingOut = () => {
    //     firebase.auth().signOut()
    //         .then(res => {
    //             const signedOutUser = {
    //                 isSingIn: false,
    //                 name: '',
    //                 email: '',
    //                 photo: ''
    //             }
    //             setUser(signedOutUser);
    //         })
    //         .catch(error => {
    //             console.log(error.message);
    //         })
    // }


    // const handleFbSingIn = () => {
    //     var fbProvider = new firebase.auth.FacebookAuthProvider();
    //     firebase
    //         .auth()
    //         .signInWithPopup(fbProvider)
    //         .then((result) => {
    //             var user = result.user;
    //             console.log(user);
    //         })
    //         .catch((error) => {
    //             var errorMessage = error.message;
    //             console.log(errorMessage);
    //         });
    // }



    const googleSingIn = () => {
        handleGoogleSingIn()
            .then(res => {
                setUser(res);
                setLoggedInUser(res);
                history.replace(from);
            })
    }

    const fbSingIn = () => {
        handleFbSingIn()
            .then(res => {
                setUser(res);
                setLoggedInUser(res);
                history.replace(from);
            })
    }

    const singOut = () => {
        handleSingOut()
            .then(res => {
                setUser(res);
                setLoggedInUser(res);
            })
    }

    // Form Validation check
    const handleBlur = (e) => {
        let isFieldValid = true;
        // console.log(e.target.name, e.target.value);

        if (e.target.name === 'email') {
            isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
            // console.log(isFieldValid);
        }
        if (e.target.name === 'password') {
            isFieldValid = /\d{1}/.test(e.target.value);
            // console.log(isFieldValid);
        }
        if (isFieldValid) {
            const newUserInfo = { ...user };
            newUserInfo[e.target.name] = e.target.value;
            setUser(newUserInfo);
        }
    }

    // Handle Submit function/Button
    const handleSubmit = (e) => {
        e.preventDefault();
        if (newUser && user.email && user.password) {
            createUserWithEmailAndPassword(user.name, user.email, user.password)
                .then(res => {
                    setUser(res);
                    setLoggedInUser(res);
                    history.replace(from);
                })
            // firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
            //     .then((user) => {
            //         const newUserInfo = { ...user };
            //         newUserInfo.error = '';
            //         newUserInfo.success = true;
            //         setUser(newUserInfo);
            //         updateUserInfo(user.name);
            //         console.log(user);
            //     })
            //     .catch((error) => {
            //         const newUserInfo = { ...user };
            //         newUserInfo.error = error.message;
            //         newUserInfo.success = false;
            //         setUser(newUserInfo);
            //     });
        }
        if (!newUser && user.email && user.password) {
            signInWithEmailAndPassword(user.email, user.password)
                .then(res => {
                    setUser(res);
                    setLoggedInUser(res);
                    history.replace(from);
                })
            // firebase.auth().signInWithEmailAndPassword(user.email, user.password)
            //     .then((res) => {
            //         const newUserInfo = { ...user };
            //         newUserInfo.error = '';
            //         newUserInfo.success = true;
            //         setUser(newUserInfo);
            //         setLoggedInUser(newUserInfo);
            //         history.replace(from);
            //         console.log(res);
            //     })
            //     .catch((error) => {
            //         const newUserInfo = { ...user };
            //         newUserInfo.error = error.message;
            //         newUserInfo.success = false;
            //         setUser(newUserInfo);
            //     });
        }

    }

    // const updateUserInfo = name => {
    //     var user = firebase.auth().currentUser;

    //     user.updateProfile({
    //         displayName: name
    //     }).then(function () {
    //         console.log('user name update');
    //     }).catch(function (error) {
    //         console.log(error);
    //     });
    // }

    return (
        <div style={{ textAlign: 'center' }}>
            {
                user.isSingIn
                    ? <button className="googleSingIn" onClick={singOut}>Sing Out Google</button>
                    : <button className="googleSingIn" onClick={googleSingIn}>Sing In Google</button>
            }
            {
                user.isSingIn && <div>
                    <h4>Welcome, {user.name} Google!</h4>
                    <h5>Your Email: {user.email}</h5>
                    <img src={user.photo} alt="" />
                </div>
            }
            <br />
            <button className="fbSingIn" onClick={fbSingIn}>Sing In Facebook</button>

            <h1>My Own Authentication</h1>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Password: {user.password}</p>
            <form className="login" onSubmit={handleSubmit}>
                <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" />
                <label htmlFor="newUser">New User Sing Up </label>
                <br /><br />

                {newUser && <input className="input-field" type="text" onBlur={handleBlur} name="name" placeholder="your name" required />}
                <br />
                <input className="input-field" type="text" onBlur={handleBlur} name="email" placeholder="your email" required />
                <br />
                <input className="input-field" type="password" onBlur={handleBlur} name="password" placeholder="your password" required />
                <br />
                <input className="input-submit" type="submit" value={newUser ? 'Sing Up' : 'Sing In'} />
            </form>
            <p style={{ color: 'red' }}>{user.error}</p>
            {user.success && <p>User {newUser ? 'created' : 'Logged In'} Successfully!</p>}
        </div>
    );
}

export default Login;
