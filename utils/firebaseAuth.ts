import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export const signIn = async () => {
  const { $auth, $firestore } = useNuxtApp();
  const provider = new GoogleAuthProvider();

  const { user } = await signInWithPopup($auth, provider);
  const idToken = await user.getIdToken();
  // 認証したらfirestoreにユーザー情報を保存する
  const userRef = doc($firestore, "users", user.uid).withConverter(
    firestoreAuthUserConverter
  );
  const docRef = await setDoc(userRef, {
    token: idToken,
    uid: user.uid,
    name: user.displayName,
  });
  console.log("Document written with ID: ", docRef);
};

function signOut() {
  const { $auth } = useNuxtApp();
  return firebaseSignOut($auth);
}
