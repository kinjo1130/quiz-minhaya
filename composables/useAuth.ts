import { useAuth as vueUseAuth } from '@vueuse/firebase'
import type { User } from '~/types'

export const useAuth = () => {
  const { $auth } = useNuxtApp()
  const { isAuthenticated, user } = vueUseAuth($auth)

  return {
    isAuthenticated,
    user: computed(() =>
      user.value
        ? {
          uid: user.value.uid,
          name: user.value.displayName
        } as User
        : null
    )
  }
}
