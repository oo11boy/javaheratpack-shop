import { NextResponse } from "next/server";
import ftp, { Options } from "ftp";

interface FileInfo {
  name: string;
  type: "video" | "image";
  link: string;
}

async function connectFTP() {
  const client = new ftp();
  const config: Options = {
    host: process.env.FTP_HOST,
    user: process.env.FTP_USER,
    password: process.env.FTP_PASSWORD,
    port: parseInt(process.env.FTP_PORT || "21"),
  };

  await new Promise<void>((resolve, reject) => {
    client.on("ready", () => resolve());
    client.on("error", (err) => reject(err));
    client.connect(config);
  });

  return client;
}

// دریافت لیست فایل‌ها
export async function GET() {
  const client = await connectFTP();
  const videoExtensions = [".mp4", ".mkv", ".avi", ".mov"];
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif"];
  let files: FileInfo[] = [];

  try {
    // دریافت فایل‌های ویدیو
    const videoFiles = await new Promise<FileInfo[]>((resolve, reject) => {
      client.list("/cvideo", (err, list) => {
        if (err) return reject(err);
        const videos = list
          .filter((item) => item.type === "-" && videoExtensions.some((ext) => item.name.toLowerCase().endsWith(ext)))
          .map((item) => ({
            name: item.name,
            type: "video" as const,
            link: `https://dl.shivid.co/cvideo/${item.name}`,
          }));
        resolve(videos);
      });
    });

    // دریافت فایل‌های تصویر
    const imageFiles = await new Promise<FileInfo[]>((resolve, reject) => {
      client.list("/jimg", (err, list) => {
        if (err) return reject(err);
        const images = list
          .filter((item) => item.type === "-" && imageExtensions.some((ext) => item.name.toLowerCase().endsWith(ext)))
          .map((item) => ({
            name: item.name,
            type: "image" as const,
            link: `https://dl.shivid.co/jimg/${item.name}`,
          }));
        resolve(images);
      });
    });

    files = [...videoFiles, ...imageFiles];
    client.end();

    return NextResponse.json({ success: true, files });
  } catch (error) {
    client.end();
    return NextResponse.json(
      { success: false, message: `خطا در دریافت فایل‌ها: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}

// حذف فایل
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const filePath = searchParams.get("filePath");

  if (!filePath) {
    return NextResponse.json(
      { success: false, message: "مسیر فایل مشخص نشده است." },
      { status: 400 }
    );
  }

  const client = await connectFTP();

  try {
    await new Promise<void>((resolve, reject) => {
      client.delete(filePath, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    client.end();
    return NextResponse.json({ success: true, message: "فایل با موفقیت حذف شد." });
  } catch (error) {
    client.end();
    return NextResponse.json(
      { success: false, message: `خطا در حذف فایل: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}