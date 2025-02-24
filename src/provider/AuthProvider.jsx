import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useState } from "react";
import auth from "../firebase/firebase.init";
import { createContext } from "react";
import { useEffect } from "react";
import PropTypes from "prop-types";

import { socket } from "../utils/socket";
export const AuthContext = createContext(null);
const googleProvider = new GoogleAuthProvider();
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const googleSignIn = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const logOut = () => {
    return signOut(auth);
  };
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);

        try {
          socket.emit("users-creation", {
            email: currentUser?.email,
            name: currentUser?.displayName,
          });

          console.log("hello world");
        } catch (error) {
          console.log(error);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unSubscribe();
  }, []);
  console.log(user);

  const authInfo = {
    user,
    loading,
    googleSignIn,
    logOut,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
}

export default AuthProvider;

AuthProvider.propTypes = {
  children: PropTypes.element,
};
