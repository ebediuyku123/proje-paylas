import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
} from 'firebase/storage';
import { storage } from './config';

export type UploadProgressCallback = (progress: number) => void;

export const uploadFile = async (
  file: File,
  path: string,
  onProgress?: UploadProgressCallback
): Promise<string> => {
  const storageRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(Math.round(progress));
      },
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(url);
      }
    );
  });
};

export const uploadProjectCover = async (
  file: File,
  projectId: string,
  onProgress?: UploadProgressCallback
): Promise<string> => {
  const ext = file.name.split('.').pop();
  const path = `projects/${projectId}/cover.${ext}`;
  return uploadFile(file, path, onProgress);
};

export const uploadProjectGalleryImage = async (
  file: File,
  projectId: string,
  index: number,
  onProgress?: UploadProgressCallback
): Promise<string> => {
  const ext = file.name.split('.').pop();
  const path = `projects/${projectId}/gallery/${index}-${Date.now()}.${ext}`;
  return uploadFile(file, path, onProgress);
};

export const uploadProjectZip = async (
  file: File,
  projectId: string,
  onProgress?: UploadProgressCallback
): Promise<string> => {
  const path = `projects/${projectId}/files/${file.name}`;
  return uploadFile(file, path, onProgress);
};

export const uploadAvatar = async (
  file: File,
  onProgress?: UploadProgressCallback
): Promise<string> => {
  const ext = file.name.split('.').pop();
  const path = `settings/avatar.${ext}`;
  return uploadFile(file, path, onProgress);
};

export const deleteFile = async (url: string): Promise<void> => {
  try {
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);
  } catch {
    // File may not exist, silently ignore
  }
};

export const listProjectFiles = async (projectId: string) => {
  const listRef = ref(storage, `projects/${projectId}`);
  const result = await listAll(listRef);
  return result.items;
};
