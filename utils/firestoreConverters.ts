import type { AuthUser, Question, Room, User } from "~/types";
import type { QueryDocumentSnapshot } from "firebase/firestore";

export const firestoreRoomConverter = {
  toFirestore: (room: Room) => room,
  fromFirestore: (snapshot: QueryDocumentSnapshot<Room>) => snapshot.data()
} as const;

export const firestoreAuthUserConverter = {
  toFirestore: (user: AuthUser) => user,
  fromFirestore: (snapshot: QueryDocumentSnapshot<AuthUser>) => snapshot.data()
}


export const firestoreUserConverter = {
  toFirestore: (user: User) => user,
  fromFirestore: (snapshot: QueryDocumentSnapshot<User>) => snapshot.data()
}

export const firestoreQuestionConverter = {
  toFirestore: (question: Question) => ({
    isRemoved: question.isRemoved,
    question: question.question,
    answer: question.answer
  }),
  fromFirestore: (snapshot: QueryDocumentSnapshot<Omit<Question, "id">>) => ({
    id: snapshot.id,
    ...snapshot.data()
  })
}
