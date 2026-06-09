'use client';

import { useState, useCallback } from 'react';
import { uploadProjectCover, uploadProjectGalleryImage, uploadProjectZip, uploadAvatar, type UploadProgressCallback } from '@/lib/firebase/storage';

interface UploadState {
  progress: number;
  uploading: boolean;
  error: string | null;
}

export function useUpload() {
  const [state, setState] = useState<UploadState>({
    progress: 0,
    uploading: false,
    error: null,
  });

  const onProgress: UploadProgressCallback = useCallback((progress: number) => {
    setState((prev) => ({ ...prev, progress }));
  }, []);

  const uploadCover = useCallback(
    async (file: File, projectId: string): Promise<string> => {
      setState({ progress: 0, uploading: true, error: null });
      try {
        const url = await uploadProjectCover(file, projectId, onProgress);
        setState({ progress: 100, uploading: false, error: null });
        return url;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Yükleme başarısız';
        setState({ progress: 0, uploading: false, error: msg });
        throw err;
      }
    },
    [onProgress]
  );

  const uploadGallery = useCallback(
    async (files: File[], projectId: string): Promise<string[]> => {
      setState({ progress: 0, uploading: true, error: null });
      try {
        const urls: string[] = [];
        for (let i = 0; i < files.length; i++) {
          const url = await uploadProjectGalleryImage(files[i], projectId, i, (p) =>
            setState((prev) => ({ ...prev, progress: Math.round((i / files.length) * 100 + p / files.length) }))
          );
          urls.push(url);
        }
        setState({ progress: 100, uploading: false, error: null });
        return urls;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Yükleme başarısız';
        setState({ progress: 0, uploading: false, error: msg });
        throw err;
      }
    },
    []
  );

  const uploadZip = useCallback(
    async (file: File, projectId: string): Promise<string> => {
      setState({ progress: 0, uploading: true, error: null });
      try {
        const url = await uploadProjectZip(file, projectId, onProgress);
        setState({ progress: 100, uploading: false, error: null });
        return url;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Yükleme başarısız';
        setState({ progress: 0, uploading: false, error: msg });
        throw err;
      }
    },
    [onProgress]
  );

  const uploadAvatarFile = useCallback(
    async (file: File): Promise<string> => {
      setState({ progress: 0, uploading: true, error: null });
      try {
        const url = await uploadAvatar(file, onProgress);
        setState({ progress: 100, uploading: false, error: null });
        return url;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Yükleme başarısız';
        setState({ progress: 0, uploading: false, error: msg });
        throw err;
      }
    },
    [onProgress]
  );

  const reset = useCallback(() => {
    setState({ progress: 0, uploading: false, error: null });
  }, []);

  return { ...state, uploadCover, uploadGallery, uploadZip, uploadAvatarFile, reset };
}
