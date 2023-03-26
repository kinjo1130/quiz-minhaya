<template>
  <button type="button" @click="login">ログイン</button>
</template>
<script setup lang="ts">
import { useAuth } from "~~/composables/useAuth";
const login = () => {
  const router = useRouter();
  const { signIn } = useAuth();
  signIn()
    .then(() => {
      console.log("ログイン成功");
      router.push("/");
    })
    .catch((error) => {
      console.log("ログイン失敗", error);
    });
};
</script>
