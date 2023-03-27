import {
  signOut as firebaseSignOut,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import type { AuthUser } from "~/types";

export const useAuth = () => {
  const loginUser = useState<AuthUser | null>("loginUser", () => null);
  async function signIn() {
    return await new Promise<void>((resolve, reject) => {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const { $firestore } = useNuxtApp();

      return signInWithPopup(auth, provider)
        .then((userCredential) => {
          userCredential.user
            .getIdToken()
            .then(async (idToken) => {
              loginUser.value = {
                token: idToken,
                uid: userCredential.user.uid,
                name: userCredential.user.displayName || "",
              };
              // 認証したらfirestoreにユーザー情報を保存する
              const userRef = doc(
                $firestore,
                "users",
                loginUser.value.uid
              ).withConverter(firestoreAuthUserConverter);
              const docRef = await setDoc(userRef, {
                token: loginUser.value.token,
                uid: loginUser.value.uid,
                name: loginUser.value.name,
              });
              console.log("Document written with ID: ", await docRef);
              resolve();
            })
            .catch(reject);
        })
        .catch(reject);
    });
  }

  async function signOut() {
    return await new Promise<void>((resolve, reject) => {
      const auth = getAuth();
      firebaseSignOut(auth)
        .then(() => {
          loginUser.value = null;
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  async function currentUser() {
    return await new Promise<void>((resolve, reject) => {
      onAuthStateChanged(getAuth(), (user) => {
        if (user) {
          resolve();
        } else {
          reject();
        }
      });
    });
  }
  async function checkAuthState() {
    return await new Promise<void>((resolve, reject) => {
      // client only
      if (process.server) return resolve();
      const auth = getAuth();
      onAuthStateChanged(
        auth,
        (user) => {
          if (user) {
            user
              .getIdToken()
              .then((idtoken) => {
                loginUser.value = {
                  token: idtoken,
                  uid: user.uid,
                  name: user.displayName || "",
                };
                console.log("useAuth", loginUser.value);
                resolve();
              })
              .catch(reject);
          } else {
            loginUser.value = null;
            resolve();
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  return {
    signIn,
    signOut,
    checkAuthState,
    loginUser,
    currentUser,
  };
};
