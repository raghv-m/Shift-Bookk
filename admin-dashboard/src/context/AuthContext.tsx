import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  UserCredential
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { AppUser } from '../types';

export interface AuthContextType {
  currentUser: FirebaseUser | null;
  user: FirebaseUser | null;
  userRole: string | null;
  loading: boolean;
  signup: (email: string, password: string) => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signOut: () => Promise<void>;
  updateUserProfile: (userId: string, userData: Partial<AppUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  return useContext(AuthContext) as AuthContextType;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const location = window.location.pathname;
  const isPublicRoute = location === '/' || location === '/login' || location === '/signup';

  useEffect(() => {
    setLoading(true);
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as AppUser;
            setUserRole(userData.role || null);
          } else {
            setUserRole(null);
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email: string, password: string): Promise<UserCredential> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user: firebaseUser } = userCredential;

      const newUser: AppUser = {
        id: firebaseUser.uid,
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: '',
        department: '',
        role: 'employee',
        status: 'active',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
      setCurrentUser(firebaseUser);
      return userCredential;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string): Promise<UserCredential> => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
      setCurrentUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  const signOut = logout;
  const signIn = login;

  const updateUserProfile = async (userId: string, userData: Partial<AppUser>): Promise<void> => {
    if (!currentUser) return;

    try {
      const updatedUser = {
        ...currentUser,
        ...userData,
        updatedAt: Timestamp.now()
      };

      await updateDoc(doc(db, 'users', userId), updatedUser);
      setCurrentUser(updatedUser as FirebaseUser);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const contextValue: AuthContextType = {
    currentUser,
    user: currentUser,
    userRole,
    loading,
    signup,
    login,
    logout,
    signIn,
    signOut,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 