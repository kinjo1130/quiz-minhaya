import { MaybeRef } from "@vueuse/core"
import { DocumentReference, doc, getFirestore } from "firebase/firestore"
import { Room } from "~/types";


export const useRoom = (roomId: MaybeRef<string>) => {
  const { $firestore } = useNuxtApp();    
  const roomRef = computed(() => {
    const id = typeof roomId === "string" ? roomId : roomId.value;
    return doc($firestore, "rooms", id).withConverter(firestoreRoomConverter);
  });
  const  room = useFirestore(roomRef);

  return {
    room,
    roomRef
  }
}
