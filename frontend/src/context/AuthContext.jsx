/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { auth, db } from "../services/firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get or create user document in Firestore
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        let isAdmin = false;
        if (userSnap.exists()) {
          isAdmin = userSnap.data().admin === true;
        } else {
          // Create user document if it doesn't exist
          await setDoc(userRef, {
            name: firebaseUser.displayName || "",
            email: firebaseUser.email,
            phone: "",
            address: "",
            admin: false,
            createdAt: serverTimestamp(),
          });
        }

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          admin: isAdmin,
        });
        localStorage.setItem("auth_token", firebaseUser.accessToken);
      } else {
        setUser(null);
        localStorage.removeItem("auth_token");
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = useCallback(async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  }, []);

  const register = useCallback(async (email, password, name) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (name) {
      await updateProfile(cred.user, { displayName: name });
    }
    // Create user document in Firestore
    const userRef = doc(db, "users", cred.user.uid);
    await setDoc(userRef, {
      name: name || "",
      email: email,
      phone: "",
      address: "",
      admin: false,
      createdAt: serverTimestamp(),
    });
    return cred.user;
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    localStorage.removeItem("auth_token");
  }, []);

  // Refresh user data from Firestore (call after making admin)
  const refreshUser = useCallback(async () => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return;

    const userRef = doc(db, "users", firebaseUser.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        admin: userSnap.data().admin === true,
      });
    }
  }, []);

  const value = { user, loading, login, register, logout, refreshUser };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
