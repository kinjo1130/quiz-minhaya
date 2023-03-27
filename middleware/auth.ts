import { onAuthStateChanged } from 'firebase/auth'

export default defineNuxtRouteMiddleware(async () => {
  const { $auth } = useNuxtApp()
  const { isAuthenticated } = useAuth()
  await new Promise<void>((resolve) => {
    const unsubscribe = onAuthStateChanged($auth, () => {
      unsubscribe()
      resolve()
    })
  })
  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }
})
