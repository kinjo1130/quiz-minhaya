import {
  signOut as firebaseSignOut,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";

interface LoginUser {
  uid: string;
  token: string;
  displayName: string;
}
export const useAuth = () => {
  const loginUser = useState<LoginUser | null>("loginUser", () => null);
  async function signIn() {
    return await new Promise<void>((resolve, reject) => {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const { $firebaseDB } = useNuxtApp();

      return signInWithPopup(auth, provider)
        .then((userCredential) => {
          userCredential.user
            .getIdToken()
            .then(async (idToken) => {
              loginUser.value = {
                token: idToken,
                uid: userCredential.user.uid,
                displayName: userCredential.user.displayName || "",
              };
              // 認証したらfirestoreにユーザー情報を保存する
              const userRef = doc(
                $firebaseDB,
                "users",
                loginUser.value.uid
              );
              const docRef = await setDoc(userRef, {
                token: loginUser.value.token,
                uid: loginUser.value.uid,
                displayName: loginUser.value.displayName,
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
                  displayName: user.displayName || "",
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
