import type { AuthUser, Question, Room, User } from "~/types";
import type { DocumentData, QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore";

interface Converter<T> {
  toFirestore: (value: T) => DocumentData;
  fromFirestore: (snapshot: QueryDocumentSnapshot<T>, options?: SnapshotOptions) => T;
}

const createConverter = <T>(converter?: Partial<Converter<T>>): Converter<T> => ({
  toFirestore: converter?.toFirestore ?? ((value: T) => value as DocumentData),
  fromFirestore: converter?.fromFirestore ?? ((snapshot: QueryDocumentSnapshot<T>) => snapshot.data() as T)
})

export const firestoreRoomConverter = createConverter<Room>();
export const firestoreAuthUserConverter = createConverter<AuthUser>();
export const firestoreUserConverter = createConverter<User>();

export const firestoreQuestionConverter = createConverter<Question>({
  toFirestore: (question) => ({
    isRemoved: question.isRemoved,
    question: question.question,
    answer: question.answer
  }),
  fromFirestore: (snapshot) => ({    
    ...snapshot.data(),
    id: snapshot.id
  })
});
