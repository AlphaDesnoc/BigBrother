import { ref, FirebaseStorage, getDownloadURL, uploadBytes, UploadResult } from 'firebase/storage'

export function getImage(storage: FirebaseStorage, path: string): Promise<string> {

    let image = ref(storage, path);
    return getDownloadURL(image);

}

export function setImage(storage: FirebaseStorage, path: string, file: File): Promise<UploadResult> {
    let image = ref(storage, path);
    return uploadBytes(image, file);
}