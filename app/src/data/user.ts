import { DocumentData, QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore";

export class UserData {

    firstName: string; 
    surname:string; 
    username: string; 
    email: string;
    constructor(firstName: string, surname:string, username: string, email: string) {
        this.firstName = firstName;
        this.surname = surname;
        this.username = username;
        this.email = email;
    }

}

export const userConverter = {
    toFirestore: (user: UserData) => {
        return {
            firstName: user.firstName,
            surname: user.surname,
            username: user.username,
            email: user.email,
        };
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData, DocumentData>, options?: SnapshotOptions) => {
        const data = snapshot.data(options);
        return new UserData(data.firstName, data.surname, data.username, data.email);
    }
}