import type { DocumentData, QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore'
import type { AuthUser, Question, QuizList, Room, User } from '~/types'

interface Converter<T> {
  toFirestore: (value: T) => DocumentData;
  fromFirestore: (snapshot: QueryDocumentSnapshot<T>, options?: SnapshotOptions) => T;
}

const createConverter = <T>(converter?: Partial<Converter<T>>): Converter<T> => ({
  toFirestore: converter?.toFirestore ?? ((value: T) => value as DocumentData),
  fromFirestore: converter?.fromFirestore ?? ((snapshot: QueryDocumentSnapshot<T>) => snapshot.data() as T)
})

export const firestoreRoomConverter = createConverter<Room>()
export const firestoreAuthUserConverter = createConverter<AuthUser>()
export const firestoreUserConverter = createConverter<User>()

export const firestoreQuizListConverter = createConverter<QuizList>({
  toFirestore: quizList => ({
    title: quizList.title,
    description: quizList.description
  }),
  fromFirestore: snapshot => ({
    ...snapshot.data(),
    id: snapshot.id
  })
})

export const firestoreQuestionConverter = createConverter<Question>({
  toFirestore: question => ({
    isRemoved: question.isRemoved,
    question: question.question,
    answer: question.answer
  }),
  fromFirestore: snapshot => ({
    ...snapshot.data(),
    id: snapshot.id
  })
})
