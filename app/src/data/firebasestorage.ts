import { ref, FirebaseStorage, getDownloadURL, uploadBytes, UploadResult } from 'firebase/storage'

/**
 * The function `getImage` takes a FirebaseStorage object and a path, and returns a Promise that
 * resolves to the download URL of the image at the specified path.
 * @param {FirebaseStorage} storage - The `storage` parameter is an instance of the FirebaseStorage
 * class. It represents the Firebase Storage service, which allows you to store and retrieve files in
 * the cloud.
 * @param {string} path - The `path` parameter is a string that represents the path to the image file
 * in the Firebase Storage. It should include the name of the file and any necessary subdirectories.
 * For example, if the image file is located in a folder called "images" and the file name is
 * "image.jpg",
 * @returns a Promise that resolves to a string.
 */
export function getImage(storage: FirebaseStorage, path: string): Promise<string> {

    let image = ref(storage, path);
    return getDownloadURL(image);

}

/**
 * The function `setImage` uploads a file to a specified path in Firebase Storage.
 * @param {FirebaseStorage} storage - The `storage` parameter is an instance of the FirebaseStorage
 * class. It represents the Firebase Storage service, which allows you to store and retrieve files in
 * the cloud.
 * @param {string} path - The `path` parameter is a string that represents the path where the image
 * file will be stored in the Firebase Storage.
 * @param {File} file - The `file` parameter is of type `File` and represents the image file that you
 * want to upload to Firebase Storage.
 * @returns a Promise that resolves to an UploadResult.
 */
export function setImage(storage: FirebaseStorage, path: string, file: File): Promise<UploadResult> {
    let image = ref(storage, path);
    return uploadBytes(image, file);
}