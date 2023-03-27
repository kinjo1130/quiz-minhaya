import type { MaybeRef } from '@vueuse/core'
import { doc } from 'firebase/firestore'

export const useRoom = (roomId: MaybeRef<string>) => {
  const { $firestore } = useNuxtApp()
  const roomRef = computed(() => {
    const id = typeof roomId === 'string' ? roomId : roomId.value
    return doc($firestore, 'rooms', id).withConverter(firestoreRoomConverter)
  })
  const room = useFirestore(roomRef)

  return {
    room,
    roomRef
  }
}
