import { computed, onMounted, onUnmounted, ref } from 'vue';
import { multiFactor, RecaptchaVerifier, Auth, Unsubscribe, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, sendEmailVerification, UserCredential, User, updateEmail, verifyBeforeUpdateEmail, reauthenticateWithCredential, EmailAuthProvider, EmailAuthCredential, PhoneAuthProvider, PhoneMultiFactorGenerator, getMultiFactorResolver } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { FirebaseStorage, getStorage } from "firebase/storage";
import { Firestore, getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import router from '../router';
import { UserData, userConverter } from './user';
import { getImage, setImage } from './firebasestorage'
import { parsePhoneNumberFromString } from 'libphonenumber-js';

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

/**
 * The `useAuthState` function is a custom hook in TypeScript that manages the authentication state,
 * including the user, error, and whether the user is authenticated or not.
 * @returns The function `useAuthState` returns an object with three properties: `user`, `error`, and
 * `isAuthenticated`.
 */
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

/**
 * The function `getUserState` returns a promise that resolves to `true` if there is a user
 * authenticated, and `false` otherwise.
 * @returns The `getUserState` function returns a Promise that resolves to a boolean value. If there is
 * a user authenticated, it resolves to `true`, otherwise it resolves to `false`.
 */
export const getUserState = (): Promise<User | null> => {
    return new Promise((resolve) => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                resolve(user); // Renvoie l'objet utilisateur
            } else {
                resolve(null); // Renvoie null si aucun utilisateur n'est connecté
            }
        });
    });
};

/**
 * The `logOut` function signs out the user, redirects them to the home page, and displays an alert if
 * there is an error.
 */
export const logOut = async () => {
    try {
        await signOut(auth);
        router.push('/')
    }
    catch (e) {
        alert(e);
    }
}

let user: User;

/**
 * The `authentication` function handles the authentication process for a user, including email and
 * password verification, multi-factor authentication, and redirecting to the dashboard if successful.
 * @param {string} email - A string representing the user's email address.
 * @param {string} password - The password parameter is a string that represents the user's password
 * for authentication.
 */
export async function authentication(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password).
        then(async (userCredential: UserCredential) => {
            user = userCredential.user;
            if (user.emailVerified) {
                router.push('/dashboard');
            }
            else {
                alert("Votre compte n'est pas vérifié,\n" + "Connexion impossible")
                return;
            }
        }).catch((error) => {
            if (error.code == 'auth/multi-factor-auth-required') {
                const resolver = getMultiFactorResolver(auth, error);
                const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container-id', {
                    size: 'invisible',
                    "callback": (response: string) => {
                        const phoneInfoOptions = {
                            multiFactorHint: resolver.hints[0],
                            session: resolver.session
                        };
                        const phoneAuthProvider = new PhoneAuthProvider(auth);
                        phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier)
                            .then(function (verificationId) {
                                const verificationCode: string | null = promptForVerificationCodePhone();

                                if (verificationCode !== null) {
                                    const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
                                    const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
                                    resolver.resolveSignIn(multiFactorAssertion)
                                        .then(function (userCredential) {
                                            // if (user.emailVerified) {
                                                router.push('/dashboard');
                                            // }
                                        })
                                }
                            });
                    }
                });
                recaptchaVerifier.verify();
            }
        });
}

/**
 * The function prompts the user to enter a verification code received via SMS and returns the entered
 * code as a string or null if no code is entered.
 * @returns a string or null.
 */
function promptForVerificationCodePhone(): string | null {
    return prompt("Veuillez entrer le code que vous avez reçu par SMS");
}

/**
 * The function prompts the user to enter their phone number and returns it as a string or null if no
 * input is provided.
 * @returns a string or null.
 */
function promptForPhoneNumber(): string | null {
    return prompt("Veuillez entrer votre numéro de téléphone");
}

/**
 * The function `formatPhoneNumber` takes a phone number as input and returns the formatted
 * international version of the phone number.
 * @param {string} phoneNumber - The `phoneNumber` parameter is a string that represents a phone
 * number.
 * @returns a formatted international phone number as a string.
 */
function formatPhoneNumber(phoneNumber: string): string {
    const parsedNumber = parsePhoneNumberFromString(phoneNumber, "FR");
    if (!parsedNumber) {
        throw new Error('Numéro de téléphone invalide');
    }
    return parsedNumber.formatInternational();
}

/**
 * The `activate2FA` function is used to activate two-factor authentication for a user by verifying
 * their phone number and sending a verification code.
 */
export async function activate2FA() {
    const user = auth.currentUser;
    const recaptchaVerifier = new RecaptchaVerifier(auth, "captcha", {
        size: "invisible",
        "callback": (response: string) => {
            const phoneNumber: string | null = promptForPhoneNumber();
            if (phoneNumber !== null) {
                try {
                    const formattedNumber = formatPhoneNumber(phoneNumber);
                    if (user !== null) {
                        multiFactor(user).getSession()
                            .then(function (multiFactorSession) {
                                const phoneInfoOptions = {
                                    phoneNumber: formattedNumber,
                                    session: multiFactorSession
                                };
                                const phoneAuthProvider = new PhoneAuthProvider(auth);

                                // Send SMS verification code.
                                const credentials = promptForCredentials(user.email);
                                if (credentials !== undefined) {
                                    reauthenticateWithCredential(user, credentials)
                                }
                                return phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier);
                            }).then(function (verificationId) {
                                const verificationCode: string | null = promptForVerificationCodePhone();

                                if (verificationCode !== null) {

                                    const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
                                    const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);

                                    multiFactor(user).enroll(multiFactorAssertion, "phoneNumber")
                                        .then(() => {
                                            updateUserData(null, null, user, true);
                                            alert('L\'authentification a double facteur a bien été activé !')
                                        })
                                        .catch((error) => {
                                            const errorCode = error.code;
                                            const errorMessage = error.message;
                                            alert('Activation impossible : \n' + "Error Code : " + errorCode + '\nError Message : ' + errorMessage)
                                        });
                                } else {
                                    prompt('Il nous faut le code de vérification pour activer le 2FA !')
                                }
                            });
                    }
                } catch (error) {
                    console.error("Erreur lors du formatage du numéro:", error);
                }
            }
        }
    });
    recaptchaVerifier.verify();
}

/**
 * The function creates a user account with the provided information and sends a verification email.
 * @param {string} firstName - The first name of the user.
 * @param {string} surname - The `surname` parameter is a string that represents the last name or
 * family name of the user.
 * @param {string} username - The username parameter is a string that represents the desired username
 * for the account.
 * @param {string} email - The email parameter is a string that represents the user's email address.
 * @param {string} password - The `password` parameter is a string that represents the password for the
 * user account being created.
 * @param {File | null} fileImage - The `fileImage` parameter is of type `File | null`. It represents
 * an image file that the user can upload during the account creation process. It can either be a
 * `File` object, which represents the selected image file, or `null` if no image file is selected.
 */
export async function createAccount(firstName: string, surname: string, username: string, email: string, password: string, fileImage: File | null) {
    await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential: UserCredential) => {
            user = userCredential.user;
            createUserData(firstName, surname, username, email, user, fileImage, null).then(() => {
                alert('Envoi des données de register reussi');
                if (auth.currentUser !== null) {
                    sendEmailVerification(auth.currentUser)
                        .then(async () => {
                            alert('Votre compte a bien été créé,\nUn mail de confirmation vous a été envoyé');
                            await addUserRole(user.uid, 'administrateur');
                            logOut();
                        })
                        .catch(error => {
                            const errorCode = error.code;
                            const errorMessage = error.message;
                            alert('Envoi du mail impossible : \n' + "Error Code : " + errorCode + '\nError Message : ' + errorMessage)
                        })
                }
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert("Impossible d'envoyer des données : \n" + "Error Code : " + errorCode + '\nError Message : ' + errorMessage)
            })
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert("Impossible de s'inscrire : \n" + "Error Code : " + errorCode + '\nError Message : ' + errorMessage)
        });
}

/**
 * The function `getUser` retrieves a user document from a Firestore database using the provided user
 * ID.
 * @param {string} userid - The `userid` parameter is a string that represents the unique identifier of
 * a user.
 * @returns the data of the user with the specified `userid` if it exists.
 */
export async function getUser(userid: string) {
    const ref = doc(db, "users", userid).withConverter(userConverter)
    const snapDoc = getDoc(ref);
    if ((await snapDoc).exists()) {
        return (await snapDoc).data();
    }
}

/**
 * The function `getProfileImage` returns a promise that resolves to a string representing the URL of
 * the user's profile image, if it exists.
 * @returns a Promise that resolves to a string.
 */
export function getProfileImage(): Promise<string> {
    return new Promise((resolve, _reject) => {
        if (auth.currentUser !== null) {
            getImage(storage, `images/users/${auth.currentUser.uid}.png`)
                .then((url) => {
                    if (url !== undefined) {
                        resolve(url);
                    }
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    alert("Impossible de récuperer l'image : \n" + "Error Code : " + errorCode + '\nError Message : ' + errorMessage)
                })
        }
    });
}

/**
 * The function `setProfileImage` takes a file as input and uploads it to a storage location, with the
 * file name being the current user's UID.
 * @param {File} file - The `file` parameter is of type `File` and represents the image file that needs
 * to be set as the profile image.
 * @returns a Promise.
 */
export function setProfileImage(file: File) {
    return new Promise((_resolve, _reject) => {
        if (auth.currentUser !== null) {
            const originalFile = new File([file], file.name, { type: "image/png" });
            const renamedFile = new File([originalFile], `${auth.currentUser.uid}.png`, { type: originalFile.type });
            setImage(storage, `images/users/${renamedFile.name}`, renamedFile)
                .then((_snapshot) => {
                    // location.reload();
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    alert("Impossible d'envoyer l'image : \n" + "Error Code : " + errorCode + '\nError Message : ' + errorMessage)
                })
        }
    })
}

/**
 * The function `updateProfileImage` updates the profile image of the current user with the provided
 * file.
 * @param {File} file - The `file` parameter is of type `File` and represents the image file that needs
 * to be updated for the user's profile image.
 * @returns a Promise.
 */
export function updateProfileImage(file: File) {
    return new Promise((_resolve, _reject) => {
        if (auth.currentUser !== null) {
            const originalFile = new File([file], file.name, { type: "image/png" });
            const renamedFile = new File([originalFile], `${auth.currentUser.uid}.png`, { type: originalFile.type });
            setImage(storage, `images/users/${renamedFile.name}`, renamedFile)
                .then((_snapshot) => {
                    location.reload();
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    alert("Impossible d'envoyer l'image : \n" + "Error Code : " + errorCode + '\nError Message : ' + errorMessage)
                })
        }
    })
}

/**
 * The function `getCurrentUser` returns a promise that resolves to the current user's data if the user
 * is authenticated, otherwise it displays an error message.
 * @returns The function `getCurrentUser` returns a Promise that resolves to a `UserData` object.
 */
export function getCurrentUser(): Promise<UserData> {
    return new Promise((resolve, _reject) => {
        if (auth.currentUser !== null) {
            getUser(auth.currentUser.uid)
                .then((userData) => {
                    if (userData !== undefined) {
                        resolve(userData);
                    }
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    alert("Impossible de récuperer l'utilisateur : \n" + "Error Code : " + errorCode + '\nError Message : ' + errorMessage)
                })
        }
    });
}

/**
 * The function `getUserData` retrieves user data asynchronously and returns a promise that resolves
 * with the user data.
 * @param {User} user - The `user` parameter is of type `User`, which represents a user object. It
 * likely contains properties such as `uid` (user ID) that are used to retrieve user data.
 * @returns a Promise that resolves to a UserData object.
 */
export function getUserData(user: User): Promise<UserData> {
    return new Promise((resolve, _reject) => {
        if (auth.currentUser !== null) {
            getUser(user.uid)
                .then((userData) => {
                    if (userData !== undefined) {
                        resolve(userData);
                    }
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    alert("Impossible de récuperer l'utilisateur : \n" + "Error Code : " + errorCode + '\nError Message : ' + errorMessage)
                })
        }
    });
}


/**
 * The function prompts the user for their password and returns their email and password as
 * credentials.
 * @param {string | null} email - The email parameter is a string or null value. It represents the
 * user's email address.
 * @returns an instance of the EmailAuthProvider.credential class, which represents the credentials for
 * authenticating a user with an email and password.
 */
function promptForCredentials(email: string | null) {
    const password: string | null = prompt("Veuillez entrer votre mot de passe");
    if (password !== null && email !== null) {
        return EmailAuthProvider.credential(email, password);
    }
}

/**
 * The function `changeUserEmail` is an asynchronous function that allows a user to change their email
 * address after reauthentication.
 * @param {string} newEmail - The new email address that the user wants to change to.
 */
export async function changeUserEmail(newEmail: string): Promise<void> {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {

        try {
            const credentials = promptForCredentials(user.email);
            if (credentials !== undefined) {
                reauthenticateWithCredential(user, credentials).then(async _res => {
                    await verifyBeforeUpdateEmail(user, newEmail);
                    logOut();
                    alert("Email mis à jour avec succès.");
                });
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'email:", error);
            throw error; // Propager l'erreur pour une gestion ultérieure.
        }
    } else {
        throw new Error("Aucun utilisateur connecté.");
    }
}

/**
 * The function `createUserData` creates a new user data document in a Firestore database with the
 * provided information.
 * @param {string} firstName - The first name of the user.
 * @param {string} surname - The `surname` parameter is a string that represents the last name or
 * family name of the user.
 * @param {string} username - The `username` parameter is a string that represents the username of the
 * user.
 * @param {string} email - The email parameter is a string that represents the user's email address.
 * @param {User} user - The `user` parameter is an object that represents the currently logged-in user.
 * It contains information about the user, such as their unique identifier (`uid`).
 * @param {File | null} fileImage - The `fileImage` parameter is of type `File | null`. It represents
 * an image file that the user wants to set as their profile image. It can either be a `File` object or
 * `null` if no image is provided.
 * @param {boolean | null} mfa - The `mfa` parameter stands for Multi-Factor Authentication. It is a
 * boolean value that indicates whether the user has enabled or disabled MFA for their account.
 */
async function createUserData(firstName: string, surname: string, username: string, email: string, user: User, fileImage: File | null, mfa: boolean | null): Promise<void> {

    if (fileImage !== null) {
        setProfileImage(fileImage);
    }
    const ref = doc(db, "users", user.uid).withConverter(userConverter);
    await setDoc(ref, new UserData(firstName, surname, username, email, mfa))
}

/**
 * The function `updateUserData` updates the user's username, email, and MFA status in the database.
 * @param {string | null} username - The username parameter is a string that represents the new
 * username for the user. It can be null if you don't want to update the username.
 * @param {string | null} email - The `email` parameter is a string that represents the new email
 * address for the user. It can be `null` if you don't want to update the email address.
 * @param {User} user - The `user` parameter is an object that represents the current user. It
 * typically contains information such as the user's unique identifier (`uid`) and other user-specific
 * data.
 * @param {boolean | null} mfa - The `mfa` parameter stands for Multi-Factor Authentication. It is a
 * boolean value that indicates whether the user has enabled or disabled MFA for their account.
 */
export async function updateUserData(username: string | null, email: string | null, user: User, mfa: boolean | null): Promise<void> {
    try {
        const userData = await getUserData(user);

        let userName = username || userData.username;
        let Email = email || userData.email;

        const ref = doc(db, "users", user.uid).withConverter(userConverter);

        if (email) {
            await changeUserEmail(email);
        }

        await setDoc(ref, new UserData(userData.firstName, userData.surname, userName, Email, mfa));
    } catch (error) {
        console.error("Erreur lors de la mise à jour des données utilisateur", error);
        throw error; // Propager l'erreur pour une gestion plus poussée
    }
}

/**
 * The function `addUserRole` adds a role to a user in a Firestore database.
 * @param {string} userId - A string representing the unique identifier of the user for whom the role
 * needs to be added.
 * @param {string} role - The `role` parameter is a string that represents the role you want to assign
 * to the user.
 * @returns a Promise.
 */
async function addUserRole(userId: string, role: string) {
    const db = getFirestore();
    const userRoleRef = doc(db, 'userRoles', userId);
    return setDoc(userRoleRef, { role });
}

async function getUserRole(userId: string) {
    const userRoleRef = doc(db, 'userRoles', userId);
    const userRoleSnap = await getDoc(userRoleRef);

    if (!userRoleSnap.exists()) {
        return null;
    }

    return userRoleSnap.data().role;
}

// Fonction optimisée pour obtenir les rôles de l'utilisateur
export async function getUserRoles(userId: string) {
    const userRole = await getUserRole(userId);

    if (!userRole) {
        return [];
    }

    const roleRef = doc(db, 'roles', userRole);
    const roleSnap = await getDoc(roleRef);

    if (!roleSnap.exists()) {
        return [];
    }

    const inherits = roleSnap.data().inherits;
    return [userRole, ...inherits];
}

// Fonction optimisée pour obtenir le pouvoir d'un rôle
export async function getPowerFromRole(userId: string) {
    const userRole = await getUserRole(userId);

    if (!userRole) {
        return null;
    }

    const roleRef = doc(db, 'roles', userRole);
    const roleSnap = await getDoc(roleRef);

    if (!roleSnap.exists()) {
        return null;
    }

    return roleSnap.data().power;
}