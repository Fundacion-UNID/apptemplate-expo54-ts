// utils/firebase-auth.ts
import { Platform } from 'react-native';
import rnAuth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { 
  getAuth, 
  signInWithCredential, 
  GoogleAuthProvider, 
  OAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as signOutWeb,
  UserCredential
} from 'firebase/auth';

// This function provides a common interface for UserCredential across platforms.
// The web SDK and the react-native-firebase SDK have slightly different type definitions.
const toCommonUserCredential = (cred: UserCredential): FirebaseAuthTypes.UserCredential => {
  return cred as unknown as FirebaseAuthTypes.UserCredential;
};

/**
* Signs in with Google using Firebase. Chooses the correct SDK based on the platform.
* @param idToken - The ID token from Google Sign-In.
* @returns {Promise<FirebaseAuthTypes.UserCredential>}
*/
export const signInWithGoogle = async (idToken: string): Promise<FirebaseAuthTypes.UserCredential> => {
  if (!idToken) throw new Error("Google ID token is missing.");

  if (Platform.OS === 'web') {
    const credential = GoogleAuthProvider.credential(idToken);
    const webAuth = getAuth();
    const userCredential = await signInWithCredential(webAuth, credential);
    return toCommonUserCredential(userCredential);
  } else {
    const credential = rnAuth.GoogleAuthProvider.credential(idToken);
    return await rnAuth().signInWithCredential(credential);
  }
};

/**
* Signs in with Apple using Firebase. Chooses the correct SDK based on the platform.
* @param idToken - The ID token from Apple Sign-In.
* @returns {Promise<FirebaseAuthTypes.UserCredential>}
*/
export const signInWithApple = async (idToken: string): Promise<FirebaseAuthTypes.UserCredential> => {
  if (!idToken) throw new Error("Apple ID token is missing.");
  
  if (Platform.OS === 'web') {
    const provider = new OAuthProvider('apple.com');
    const credential = provider.credential({
      idToken,
      rawNonce: 'should-be-generated-for-prod', // IMPORTANT: Generate a new random nonce for each sign-in attempt in production.
    });
    const webAuth = getAuth();
    const userCredential = await signInWithCredential(webAuth, credential);
    return toCommonUserCredential(userCredential);
  } else {
    const credential = rnAuth.AppleAuthProvider.credential(idToken);
    return await rnAuth().signInWithCredential(credential);
  }
};

/**
* Firebase Sign-Up or Custom Email/Password Sign-In.
* @param email - The email address of the user.
* @param password - The user's password.
* @returns Firebase user credential.
*/
export const signUpOrSignInWithEmail = async (email: string, password: string): Promise<FirebaseAuthTypes.UserCredential> => {
  if (Platform.OS === 'web') {
    const webAuth = getAuth();
    try {
      const userCredential = await signInWithEmailAndPassword(webAuth, email, password);
      return toCommonUserCredential(userCredential);
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        const userCredential = await createUserWithEmailAndPassword(webAuth, email, password);
        return toCommonUserCredential(userCredential);
      }
      throw error;
    }
  } else {
    try {
      return await rnAuth().signInWithEmailAndPassword(email, password);
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        return await rnAuth().createUserWithEmailAndPassword(email, password);
      }
      throw error;
    }
  }
};

/**
* Logs out the current Firebase user.
* @returns {Promise<void>}
*/
export const signOut = async (): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      await signOutWeb(getAuth());
    } else {
      await rnAuth().signOut();
    }
    console.log('User signed out successfully');
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};
