/**
 * Seeds initial Firestore data after admin login.
 * Usage: node scripts/seed-firestore.mjs <admin-password>
 */
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDJrnrj5IQsPxj7OWIRxBGqr7OnBJkgKyA',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'projepaylas.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'projepaylas',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'projepaylas.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '520389334712',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:520389334712:web:14f580c9d5e43b2ddcc64d',
};

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@example.com';
const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/seed-firestore.mjs <admin-password>');
  process.exit(1);
}

const app = initializeApp(config);
const auth = getAuth(app);
const db = getFirestore(app);

const defaultSettings = {
  developerName: 'Geliştirici',
  developerTitle: 'Full Stack Developer',
  developerBio: 'Yazılım projeleri geliştiren ve paylaşan bir geliştirici.',
  developerAvatar: '',
  githubUrl: 'https://github.com',
  linkedinUrl: 'https://linkedin.com',
  twitterUrl: 'https://twitter.com',
  email: ADMIN_EMAIL,
  websiteUrl: 'http://localhost:3000',
  techStack: [
    { id: '1', name: 'React', icon: 'react' },
    { id: '2', name: 'Next.js', icon: 'nextjs' },
    { id: '3', name: 'TypeScript', icon: 'typescript' },
    { id: '4', name: 'Firebase', icon: 'firebase' },
  ],
  categories: [],
  heroTitle: 'Yazılım Projelerini Keşfet',
  heroSubtitle: 'Modern açık kaynak ve kişisel projeler',
  seoTitle: 'ProjePaylaş — Yazılım Projeleri',
  seoDescription: 'Modern yazılım projelerini keşfet, incele ve indir.',
  ogImage: '',
};

async function main() {
  console.log('Signing in as', ADMIN_EMAIL);
  try {
    await signInWithEmailAndPassword(auth, ADMIN_EMAIL, password);
  } catch (error) {
    if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
      const { createUserWithEmailAndPassword } = await import('firebase/auth');
      console.log('User not found. Creating user...');
      await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, password);
      console.log('User created successfully.');
    } else {
      throw error;
    }
  }

  const settingsRef = doc(db, 'settings', 'main');
  const settingsSnap = await getDoc(settingsRef);

  if (!settingsSnap.exists()) {
    await setDoc(settingsRef, { ...defaultSettings, updatedAt: serverTimestamp() });
    console.log('Created settings/main');
  } else {
    console.log('settings/main already exists');
  }

  console.log('Seed complete.');
  process.exit(0);
}

main().catch((error) => {
  console.error('Seed failed:', error.code || error.message);
  process.exit(1);
});
