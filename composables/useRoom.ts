import { doc } from 'firebase/firestore'
import { Room } from '~/types'

export const useRoom = (roomId?: string) => {
  const { $firestore } = useNuxtApp()
  const _roomId = useState('roomId', () => '')
  if (roomId) { _roomId.value = roomId }
  const roomRef = computed(() =>
    doc($firestore, 'rooms', _roomId.value).withConverter(firestoreRoomConverter)
  )
  const room = useState<Room | null>('room')
  const firestoreState = useFirestore(roomRef)
  watch(firestoreState, () => { room.value = firestoreState.value ?? null })

  return {
    room,
    roomRef
  }
}
