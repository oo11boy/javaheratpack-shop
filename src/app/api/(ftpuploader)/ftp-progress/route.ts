import { NextResponse } from "next/server";

interface ProgressResponse {
  progress: number;
}

let uploadProgress: number = 0;

export function setUploadProgress(progress: number) {
  uploadProgress = progress;
}

export async function GET() {
  return NextResponse.json({ progress: uploadProgress });
}