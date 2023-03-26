import { defineNuxtPlugin } from "#app";
// import axios from "axios";
import { useAuth } from "../composables/useAuth";

export default defineNuxtPlugin(() => ({
  provide: {
    async existCurrentUser() {
      const { checkAuthState, loginUser } = useAuth();
      await checkAuthState();
      console.log("ログインしているか確認します");
      if (!loginUser.value) {
        console.log("まだログインしていません");
        useRouter().push("/login");
      } else {
        console.log(loginUser.value);
        console.log("すでにログインしています");



        return loginUser.value;
        // ログイン後に元のページへ戻る
        // const to = useRoute().redirectedFrom?.fullPath || "/event";
        // navigateTo(to, { redirectCode: 302 });
      }
    },
  },
}));
