import { DocumentData, QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore";

export class UserData {

    firstName: string; 
    surname: string; 
    username: string; 
    email: string;
    mfa: boolean | null;
    constructor(firstName: string, surname: string, username: string, email: string, mfa: boolean | null) {
        this.firstName = firstName;
        this.surname = surname;
        this.username = username;
        this.email = email;
        this.mfa = mfa;
    }

}

/* The `userConverter` object is used to convert a `UserData` object to and from a Firestore document.
It has two methods: */
export const userConverter = {
    toFirestore: (user: UserData) => {
        return {
            firstName: user.firstName,
            surname: user.surname,
            username: user.username,
            email: user.email,
            mfa: user.mfa
        };
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData, DocumentData>, options?: SnapshotOptions) => {
        const data = snapshot.data(options);
        return new UserData(data.firstName, data.surname, data.username, data.email, data.mfa);
    }
}