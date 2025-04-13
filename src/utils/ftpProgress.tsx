// utils/ftpProgress.ts
let uploadProgress: number = 0;

export function setUploadProgress(progress: number) {
  uploadProgress = progress;
}

export function getUploadProgress() {
  return uploadProgress;
}