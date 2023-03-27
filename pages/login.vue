<template>
  <button type="button" @click="login">ログイン</button>
</template>
<script setup lang="ts">
const login = () => {
  const router = useRouter();
  
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
