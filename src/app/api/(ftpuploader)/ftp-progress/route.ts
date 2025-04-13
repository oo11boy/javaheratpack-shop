import { getUploadProgress } from "@/utils/ftpProgress";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ progress: getUploadProgress() });
}