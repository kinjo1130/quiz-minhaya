<script setup lang="ts">
const login = () => {
  const router = useRouter()

  signIn()
    .then(() => {
      console.log('ログイン成功')
      router.push('/home')
    })
    .catch((error) => {
      console.log('ログイン失敗', error)
    })
}
const logout = () => {
  const router = useRouter()
  signOut()
    .then(() => {
      console.log('ログアウト成功')
      router.push('/')
    })
    .catch((error) => {
      console.log('ログアウト失敗', error)
    })
}
const { user } = useAuth()
</script>
<template>
  <header class="bg-blue-500 py-4">
    <div class="container mx-auto flex justify-between items-center">
      <div class="flex items-center text-white">
        <svg class="h-8 w-8 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 0a10 10 0 1 0 10 10A10 10 0 0 0 10 0zM6.1 12.75a1.25 1.25 0 1 1-2.5 0V7.5A1.25 1.25 0 0 1 4.35 6h7.9a1.25 1.25 0 0 1 0 2.5H6.1v4.25zM12.9 9.25a1.25 1.25 0 0 1-2.5 0V7.5a1.25 1.25 0 0 1 2.5 0v1.75zM12.9 12.75a1.25 1.25 0 0 1-2.5 0v-1.75a1.25 1.25 0 0 1 2.5 0v1.75z" />
        </svg>
        <span class="font-bold text-xl">Quiz App</span>
      </div>
      <nav>
        <!-- ログインしているときの -->
        <ul v-if="user" class="flex space-x-4 text-white text-sm font-medium">
          <li>
            <a href="/home">ホーム</a>
          </li>
          <button type="button" @click="logout">
            ログアウト
          </button>
        </ul>
        <!-- ログインしていないとき -->
        <ul v-else class="flex space-x-4 text-white text-sm font-medium">
          <li>
            <button type="button" @click="login">
              ログイン
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>
