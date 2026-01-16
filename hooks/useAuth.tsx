// hooks/useAuth.ts
import { useState } from 'react';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

// Define the shape of a sign-in function that the hook can accept.
// It must return a Firebase UserCredential.
type SignInFunction = () => Promise<FirebaseAuthTypes.UserCredential | null>;

/**
 * A generic custom hook to manage the state of an authentication process.
 * 
 * It takes a specific sign-in function as an argument, executes it, and manages
 * the loading, error, and user credential states. This makes it reusable for any
 * authentication provider (Google, Apple, etc.).
 * 
 * @returns An object containing the loading state, the authenticated user credential,
 * any error that occurred, and a function to trigger the sign-in process.
 */
export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [userCredential, setUserCredential] = useState<FirebaseAuthTypes.UserCredential | null>(null);

  /**
   * Executes a given sign-in function and manages the state.
   * @param signInFunction The provider-specific sign-in function to execute.
   */
  const handleSignIn = async (signInFunction: SignInFunction) => {
    setIsLoading(true);
    setError(null);
    setUserCredential(null);

    try {
      const credential = await signInFunction();
      if (credential) {
        setUserCredential(credential);
      }
      // If the user cancels (credential is null), we simply stop loading.
    } catch (e: any) {
      setError(e);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    userCredential,
    error,
    handleSignIn,
  };
};
