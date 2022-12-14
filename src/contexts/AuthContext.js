import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import React, { createContext, useEffect, useState } from 'react';
import app from '../firebase/firebase.config';


const auth = getAuth(app);
export const AuthProvider = createContext();
const AuthContext = ({children}) => {

    const [user, setUser] = useState(false);
    const [loading, setLoading] = useState(true);

    const createNewUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    }
    
    const userSignIn = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    }

    const userUpdateProfile = (profileInfo) => {
        setUser(profileInfo);
        return updateProfile(auth.currentUser,{displayName: profileInfo.displayName,
        photoURL: profileInfo.photoURL
        });
    } 

    const userLogout = () => {
        return signOut(auth);
    }

    const googleSignUp = provider => {
        return signInWithPopup(auth, provider);
    }
    useEffect( () => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser);
            setLoading(false);
            return () => unsubscribe();
        })
    },[user])

    const authInfo = {
        user,
        loading,
        createNewUser,
        userSignIn,
        userUpdateProfile,
        userLogout,
        setUser,
        googleSignUp
    }
    return (
        <div>
            <AuthProvider.Provider value={authInfo}>
                 {children}
            </AuthProvider.Provider>
        </div>
    );
};

export default AuthContext;