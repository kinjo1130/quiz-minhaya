import { initializeApp, getApp } from "firebase/app";
import { defineNuxtPlugin } from "#app";
import { getMessaging } from "firebase/messaging";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig().public;
  const config = {
    apiKey: runtimeConfig.apiKey,
    authDomain: runtimeConfig.authDomain,
    projectId: runtimeConfig.projectId,
    storageBucket: runtimeConfig.storageBucket,
    messagingSenderId: runtimeConfig.messagingSenderId,
    appId: runtimeConfig.appId,
  };
  const firebase = initializeApp(config);
  const messaging = getMessaging(firebase);
  const db = getFirestore(firebase);
  const functions = getFunctions(firebase);

  if (process.env.NODE_ENV === "development") {
    // 開発時はlocalhostを参照する
    const functions = getFunctions(getApp());
    connectFunctionsEmulator(functions, "localhost", 5001);
    // connectFirestoreEmulator(db, "localhost", 8080);
  }

  return {
    provide: {
      firebaseApp: firebase,
      messaging,
      firebaseDB: db,
      functions,
    },
  };
});
