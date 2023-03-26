import {
  signOut as firebaseSignOut,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

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

      return signInWithPopup(auth, provider)
        .then((userCredential) => {
          userCredential.user
            .getIdToken()
            .then((idToken) => {
              loginUser.value = {
                token: idToken,
                uid: userCredential.user.uid,
                displayName: userCredential.user.displayName || "",
              };
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
