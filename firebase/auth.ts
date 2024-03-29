import {
  getAuth,
  signInAnonymously,
  GoogleAuthProvider,
  linkWithPopup,
  signInWithCredential,
} from 'firebase/auth';
import { db } from './service';
import { addDoc, collection } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';

const pushUser = async (userId: string) => {
  const userCol = collection(db, 'users');

  try {
    const docRef = await addDoc(userCol, { userId });
    console.log('User written with ID: ' + docRef.id);
  } catch (err) {
    console.error(err);
  }
};

export const signInAnonymous = async (): Promise<string | null> => {
  const auth = getAuth();

  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user.uid;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const upgradeAnonymousToGoogle = async () => {
  const auth = getAuth();
  
  if (auth.currentUser && auth.currentUser.isAnonymous) {
    try {
      const anonymousUser = auth.currentUser;
      const provider = new GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/calendar');

      await linkWithPopup(anonymousUser, provider);
      console.log('Linking successful');
    } catch (err) {
      if (
        err instanceof FirebaseError &&
        err.code === 'auth/credential-already-in-use'
      ) {
        const credential = GoogleAuthProvider.credentialFromError(err);
        if (credential) {
          await signInWithCredential(auth, credential);
        } else {
          console.log('no credential');
        }
      }
    }
  } else {
    console.log('No anonymous user to upgrade');
  }
};
