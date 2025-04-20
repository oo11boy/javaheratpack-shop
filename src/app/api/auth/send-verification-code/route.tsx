import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import axios from "axios";
import { getConnection } from "@/lib/db";

export async function POST(req: NextRequest) {
  let connection: Awaited<ReturnType<typeof getConnection>> | null = null;

  try {
    const { phoneNumber, email } = await req.json();

    if (!phoneNumber && !email) {
      return NextResponse.json({ error: "ایمیل یا شماره موبایل الزامی است" }, { status: 400 });
    }

    connection = await getConnection();
    let isRegistered = false;
    let field = "";
    let identifier = "";

    // بررسی وجود کاربر در دیتابیس
    if (phoneNumber) {
      field = "phonenumber";
      identifier = phoneNumber;
      if (!/^09[0-9]{9}$/.test(phoneNumber)) {
        return NextResponse.json({ error: "شماره موبایل معتبر نیست" }, { status: 400 });
      }
    } else if (email) {
      field = "email";
      identifier = email;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json({ error: "ایمیل معتبر نیست" }, { status: 400 });
      }
    }

    const [rows] = await connection.execute(
      `SELECT COUNT(*) as count FROM accounts WHERE ${field} = ?`,
      [identifier]
    );
    isRegistered = (rows as any[])[0].count > 0;

    if (isRegistered) {
      // اگر کاربر ثبت‌شده است، نیازی به ارسال کد نیست
      return NextResponse.json({ message: "کاربر ثبت‌شده است", isRegistered: true });
    }

    // ادامه فرآیند ارسال کد تأیید
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (phoneNumber) {
      // ارسال پیامک
      const smsApiUrl = "https://rest.ippanel.com/v1/messages/patterns/send";
      const apiKey = process.env.IPPANEL_API_KEY || "";
      const patternCode = process.env.IPPANEL_PATTERN_CODE || "";
      const originator = process.env.IPPANEL_LINE_NUMBER || "";

      if (!apiKey || !patternCode || !originator) {
        throw new Error("IPPANEL credentials are missing");
      }

      const smsResponse = await axios.post(
        smsApiUrl,
        {
          pattern_code: patternCode,
          originator: originator,
          recipient: phoneNumber,
          values: { code: verificationCode },
        },
        {
          headers: {
            Authorization: `AccessKey ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (smsResponse.status !== 200 || !smsResponse.data) {
        return NextResponse.json({ error: "خطا در ارسال پیامک" }, { status: 500 });
      }

      // ذخیره کد تأیید
      await connection.execute(
        "INSERT INTO verification_codes (phonenumber, code, expires_at) VALUES (?, ?, ?)",
        [phoneNumber, verificationCode, new Date(Date.now() + 5 * 60 * 1000)]
      );
    } else if (email) {
      // ارسال ایمیل
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.GOOGLE_EMAIL,
          pass: process.env.GOOGLE_APP_PASSWORD,
        },
      });

      const mailOptions = {
        from: `"شوید" <${process.env.GOOGLE_EMAIL}>`,
        to: email,
        subject: "کد تأیید ثبت‌نام در شوید",
        html: `
          <!DOCTYPE html>
          <html lang="fa">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: 'Vazir', Arial, sans-serif; direction: rtl; background-color: #f4f4f9; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden; }
              .header { background: linear-gradient(90deg, #00c4b4, #007bff); padding: 20px; text-align: center; color: #ffffff; }
              .header h1 { margin: 0; font-size: 24px; }
              .content { padding: 30px; text-align: center; color: #333333; }
              .code { font-size: 32px; font-weight: bold; color: #00c4b4; margin: 20px 0; letter-spacing: 4px; }
              .instructions { font-size: 16px; line-height: 1.6; margin-bottom: 20px; }
              .footer { background-color: #f4f4f9; padding: 15px; text-align: center; font-size: 14px; color: #666666; }
              .footer a { color: #00c4b4; text-decoration: none; }
              .footer a:hover { text-decoration: underline; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>خوش آمدید به شوید</h1>
              </div>
              <div class="content">
                <p class="instructions">برای تکمیل ثبت‌نام، لطفاً کد تأیید زیر را در سایت وارد کنید:</p>
                <div class="code">${verificationCode}</div>
                <p class="instructions">این کد تا ۵ دقیقه معتبر است. اگر این ایمیل را شما درخواست نکردید، لطفاً آن را نادیده بگیرید.</p>
              </div>
              <div class="footer">
                <p>با تشکر، تیم <a href="https://shivid.co">shivid.co</a></p>
                <p><a href="https://shivid.co/support">پشتیبانی</a> | <a href="https://shivid.co/privacy">حریم خصوصی</a></p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

      await transporter.sendMail(mailOptions);

      // ذخیره کد تأیید
      await connection.execute(
        "INSERT INTO verification_codes (email, code, expires_at) VALUES (?, ?, ?)",
        [email, verificationCode, new Date(Date.now() + 5 * 60 * 1000)]
      );
    }

    return NextResponse.json({ message: "کد تأیید ارسال شد", isRegistered: false });
  } catch (error) {
    console.error("Send verification code error:", error);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}