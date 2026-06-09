import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from './config';

export const signIn = async (email: string, password: string) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
};

export const signOut = async () => {
  await firebaseSignOut(auth);
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

export const isAdmin = (user: User | null): boolean => {
  if (!user) return false;
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  return user.email === adminEmail;
};
