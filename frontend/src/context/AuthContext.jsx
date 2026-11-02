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

// Built-in Admin accounts for instant access
const DEFAULT_ADMINS = [
  { email: "admin@gehazek.dz", pass: "admin123" },
  { email: "admin@admin.com", pass: "admin123" },
  { email: "admin@gehazek.com", pass: "admin123" },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check for local admin session first
    const savedAdmin = localStorage.getItem("admin_session");
    if (savedAdmin) {
      try {
        const parsed = JSON.parse(savedAdmin);
        setUser(parsed);
        setLoading(false);
        return;
      } catch (e) {
        localStorage.removeItem("admin_session");
      }
    }

    // 2. Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userRef = doc(db, "users", firebaseUser.uid);
          const userSnap = await getDoc(userRef);

          let isAdmin = false;
          if (userSnap.exists()) {
            isAdmin = userSnap.data().admin === true;
          } else {
            // First registered user or matching admin email can be admin
            const isDefaultAdminEmail = DEFAULT_ADMINS.some((a) => a.email === firebaseUser.email);
            isAdmin = isDefaultAdminEmail;
            await setDoc(userRef, {
              name: firebaseUser.displayName || "",
              email: firebaseUser.email,
              phone: "",
              address: "",
              admin: isAdmin,
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
        } catch {
          // If Firestore fails, check default admin email
          const isDefaultAdmin = DEFAULT_ADMINS.some((a) => a.email === firebaseUser.email);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            admin: isDefaultAdmin,
          });
        }
      } else {
        // If not logged into Firebase and no local admin session
        if (!localStorage.getItem("admin_session")) {
          setUser(null);
          localStorage.removeItem("auth_token");
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = useCallback(async (email, password) => {
    const trimmedEmail = (email || "").trim().toLowerCase();

    // Check built-in admin credentials first
    const matchedAdmin = DEFAULT_ADMINS.find(
      (a) => a.email.toLowerCase() === trimmedEmail && a.pass === password
    );

    if (matchedAdmin) {
      const adminObj = {
        uid: "admin-master-id",
        email: matchedAdmin.email,
        displayName: "مدير المتجر (Admin)",
        admin: true,
      };
      setUser(adminObj);
      localStorage.setItem("admin_session", JSON.stringify(adminObj));
      localStorage.setItem("auth_token", "admin-demo-token");
      return adminObj;
    }

    // Otherwise use Firebase
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  }, []);

  const register = useCallback(async (email, password, name) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (name) {
      await updateProfile(cred.user, { displayName: name });
    }

    const trimmedEmail = (email || "").trim().toLowerCase();
    const isDefaultAdminEmail = DEFAULT_ADMINS.some((a) => a.email === trimmedEmail);

    try {
      const userRef = doc(db, "users", cred.user.uid);
      await setDoc(userRef, {
        name: name || "",
        email: email,
        phone: "",
        address: "",
        admin: isDefaultAdminEmail,
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.warn("Could not write user to Firestore:", e.message);
    }

    return cred.user;
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem("admin_session");
    localStorage.removeItem("auth_token");
    setUser(null);
    try {
      await signOut(auth);
    } catch (e) {}
  }, []);

  const refreshUser = useCallback(async () => {
    const savedAdmin = localStorage.getItem("admin_session");
    if (savedAdmin) {
      setUser(JSON.parse(savedAdmin));
      return;
    }

    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return;

    try {
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
    } catch (e) {}
  }, []);

  const value = { user, loading, login, register, logout, refreshUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
