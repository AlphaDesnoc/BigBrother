import { computed, onMounted, onUnmounted, ref } from 'vue';
import { Auth, Unsubscribe, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, sendEmailVerification, UserCredential, User } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { FirebaseStorage, getStorage } from "firebase/storage";
import { Firestore, getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import router from '../router';
import { UserData, userConverter } from './user';
import { getImage, setImage } from './firebasestorage'

const firebaseApp = initializeApp({
    apiKey: "AIzaSyBrwByBbn-zalKpgc4mN-B_U__WdE96hs8",
    authDomain: "bigbrother-chronosky.firebaseapp.com",
    projectId: "bigbrother-chronosky",
    storageBucket: "bigbrother-chronosky.appspot.com",
    messagingSenderId: "780766104517",
    appId: "1:780766104517:web:cdb2ceafd0c60d2397d9ac",
    measurementId: "G-HCW40EX98H"
});
export const auth: Auth = getAuth(firebaseApp);
const db: Firestore = getFirestore(firebaseApp); //Image
const storage: FirebaseStorage = getStorage(firebaseApp); //Users

export const useAuthState = () => {
    const user = ref();
    const error = ref();

    let unsubscribe: Unsubscribe;

    onMounted(() => {
        
        unsubscribe = onAuthStateChanged( 
            auth,
            u => (user.value = u),
            e => (error.value = e)
        );

    });

    onUnmounted(() => unsubscribe());

    const isAuthenticated = computed(() => user.value != null);

    return { user, error, isAuthenticated };
}

export const getUserState = () => {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        }, reject);
    });
}

export const logOut = async () => {
    try {
        await signOut(auth);
        router.push('/')
    }
    catch(e) {
        alert(e);
    }
}

let user: User;

export async function authentication(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password).
    then(async (userCredential: UserCredential) => {
        user = userCredential.user;
        if(user.emailVerified){
            router.push('/dashboard');
        }
        else {
            alert("Votre compte n'est pas vérifié,\n" + "Connexion impossible")
            return;
        }
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert('Impossible de se connecter : \n' + "Error Code : " + errorCode + '\nError Message : ' + errorMessage)
    });
}

export async function createAccount(firstName: string, surname: string, username: string, email: string, password: string, fileImage: File | null) {
    await createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential: UserCredential) => {
        user = userCredential.user;
        setUserData(firstName, surname, username, email, user).then(()=>{console.log('Envoi des données de register reussi')})
        sendEmailVerification(user)
        .then(() => {})
        .catch(error => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert('Envoi du mail impossible : \n' + "Error Code : " + errorCode + '\nError Message : ' + errorMessage)
            return;
        })
        logOut();
        if (fileImage !== null){
            setProfileImage(fileImage);
        }
        alert('Votre compte a bien été créé,\nUn mail de confirmation vous a été envoyé')
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert("Impossible de s'inscrire : \n" + "Error Code : " + errorCode + '\nError Message : ' + errorMessage)
    });
}

export async function getUser(userid: string) {
    const ref = doc(db, "users", userid).withConverter(userConverter)
    const snapDoc = getDoc(ref);
    if((await snapDoc).exists()) {
        return (await snapDoc).data();
    }
}

export function getProfileImage(): Promise<string> {
    return new Promise((resolve, _reject) => {
        if(auth.currentUser !== null) {
            getImage(storage, `images/users/${auth.currentUser.uid}.png`)
            .then((url) => {
                if (url !== undefined) {
                    resolve(url);
                }
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log("Impossible de récuperer l'image : \n" + "Error Code : " + errorCode + '\nError Message : ' + errorMessage)
            })
        }
    });
}

export function setProfileImage(file: File) {
    return new Promise((_resolve, _reject) => {
        if(auth.currentUser !== null){
            const originalFile = new File([file], file.name, { type: "image/png" });
            const renamedFile = new File([originalFile], `${auth.currentUser.uid}.png`, { type: originalFile.type });
            setImage(storage, `images/users/${renamedFile.name}`, renamedFile)
            .then((_snapshot) => {
                location.reload();
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log("Impossible d'envoyer l'image : \n" + "Error Code : " + errorCode + '\nError Message : ' + errorMessage)
            })
        }
    })
}

export function getCurrentUser(): Promise<UserData> {
    return new Promise((resolve, _reject) => {
      if(auth.currentUser !== null) {
        getUser(auth.currentUser.uid)
        .then((userData) => {
            if(userData !== undefined){
                resolve(userData);
            }
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("Impossible de récuperer l'utilisateur : \n" + "Error Code : " + errorCode + '\nError Message : ' + errorMessage)
        })
      }
    });
}

export function getUserData(user: User): Promise<UserData> {
    return new Promise((resolve, _reject) => {
      if(auth.currentUser !== null) {
        getUser(user.uid)
        .then((userData) => {
            if(userData !== undefined){
                resolve(userData);
            }
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("Impossible de récuperer l'utilisateur : \n" + "Error Code : " + errorCode + '\nError Message : ' + errorMessage)
        })
      }
    });
}

/**
 * TODO: Rajouter changement de mail fonctionnel
 */

export async function setUserData(firstname: string | null, surname: string | null, username: string | null, email: string | null, user: User): Promise<void> {
    let firstName: string = '';
    let surName: string = '';
    let userName: string = '';
    let Email: string = '';
    getUserData(user)
    .then( async (userData) => {
        firstname == null ? firstName = userData.firstName : firstName = firstname;
        surname == null ? surName = userData.surname : surName = surname;
        username == null || username == '' ? userName = userData.username : userName = username;
        email == null || email == '' ? Email = userData.email : Email = email;

        const ref = doc(db, "users", user.uid).withConverter(userConverter);
        await setDoc(ref, new UserData(firstName, surName, userName, Email));
        location.reload();
    })
}