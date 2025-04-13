import { NextResponse } from "next/server";
import ftp, { Options } from "ftp";
import { Readable } from "stream";
import { setUploadProgress } from "@/utils/ftpProgress";

interface FTPResponse {
  success: boolean;
  message: string;
  fileLink?: string;
}

async function deleteIncompleteFile(client: ftp, destinationPath: string) {
  try {
    await new Promise<void>((resolve, reject) => {
      client.delete(destinationPath, (err) => {
        if (err) {
          console.warn(`[FTP] Failed to delete incomplete file ${destinationPath}: ${err.message}`);
          resolve(); // ادامه دادن حتی در صورت خطا
        } else {
          console.log(`[FTP] Incomplete file ${destinationPath} deleted successfully`);
          resolve();
        }
      });
    });
  } catch (error) {
    console.warn(`[FTP] Error deleting incomplete file: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function uploadToFTP(file: File, fileName: string, signal: AbortSignal): Promise<FTPResponse> {
  const client = new ftp();
  const totalSize = file.size;
  const startTime = Date.now();

  const config: Options = {
    host: process.env.FTP_HOST,
    user: process.env.FTP_USER,
    password: process.env.FTP_PASSWORD,
    port: parseInt(process.env.FTP_PORT || "21"),
    connTimeout: 10000,
    pasvTimeout: 10000,
  };

  const videoExtensions = [".mp4", ".mkv", ".avi", ".mov"];
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif"];
  const extension = fileName.toLowerCase().slice(fileName.lastIndexOf("."));
  let destinationPath = fileName;

  if (videoExtensions.includes(extension)) {
    destinationPath = `cvideo/${fileName}`;
  } else if (imageExtensions.includes(extension)) {
    destinationPath = `jimg/${fileName}`;
  }

  let progressInterval: NodeJS.Timeout | null = null;

  try {
    console.log(`[FTP] Connecting to ${config.host}:${config.port}`);
    await new Promise<void>((resolve, reject) => {
      client.on("ready", () => resolve());
      client.on("error", (err) => reject(err));
      client.connect(config);
    });

    const estimatedDuration = totalSize / (1024 * 1024);
    progressInterval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = Math.min(99, Math.round((elapsed / estimatedDuration) * 100));
      setUploadProgress(progress);
      console.log(`[FTP] Estimated progress: ${progress}%`);
    }, 1000);

    const abortHandler = () => {
      if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
      }
      client.end();
      deleteIncompleteFile(client, destinationPath);
      throw new Error("Upload aborted by user");
    };
    signal.addEventListener("abort", abortHandler);

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileStream = Readable.from(buffer);

    await new Promise<void>((resolve, reject) => {
      client.put(fileStream, destinationPath, (err) => {
        if (progressInterval) {
          clearInterval(progressInterval);
          progressInterval = null;
        }
        signal.removeEventListener("abort", abortHandler);
        if (err) return reject(err);
        resolve();
      });
    });

    setUploadProgress(100);
    console.log(`[FTP] Upload completed for ${destinationPath}`);
    client.end();

    const fileLink = `https://dl.shivid.co/${destinationPath}`;
    return {
      success: true,
      message: `فایل ${fileName} با موفقیت آپلود شد.`,
      fileLink,
    };
  } catch (error) {
    if (progressInterval) {
      clearInterval(progressInterval);
      progressInterval = null;
    }
    console.error(`[FTP] Error: ${error instanceof Error ? error.message : String(error)}`);
    await deleteIncompleteFile(client, destinationPath);
    client.end();
    return {
      success: false,
      message: `خطا در آپلود فایل: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "هیچ فایلی انتخاب نشده است." },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "فایل بزرگ‌تر از ۵ گیگابایت است." },
        { status: 400 }
      );
    }

    console.log(`[FTP] Starting upload for ${file.name} (${file.size} bytes)`);
    setUploadProgress(0);
    const result = await uploadToFTP(file, file.name, request.signal);
    return NextResponse.json(result, { status: result.success ? 200 : 500 });
  } catch (error) {
    console.error(`[API] Error: ${error instanceof Error ? error.message : String(error)}`);
    return NextResponse.json(
      {
        success: false,
        message: `خطا در پردازش درخواست: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 }
    );
  }
}