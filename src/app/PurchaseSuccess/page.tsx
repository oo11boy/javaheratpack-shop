import Footer from "@/Components/Footer/Footer";
import Header from "@/Components/Header/Header";
import PurchaseSuccess from "@/Components/PurchaseSuccess/PurchaseSuccess";
import { getConnection } from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";

// تعریف متا دیتا
export const metadata = {
  title: 'شوید-آموزش طراحی جواهرات | خرید موفق',
  description: 'خرید دوره طراحی جواهرات با موفقیت انجام شد! اکنون می‌توانید به محتوای آموزشی دسترسی پیدا کنید.',
  keywords: ['خرید دوره', 'آموزش طراحی جواهرات', 'نرم‌افزار ماتریکس', 'شوید'],
  openGraph: {
    title: 'شوید-آموزش طراحی جواهرات | خرید موفق',
    description: 'خرید دوره طراحی جواهرات با موفقیت انجام شد! اکنون می‌توانید به محتوای آموزشی دسترسی پیدا کنید.',
    url: 'https://shivid.co/PurchaseSuccess',
    type: 'website',
    images: [
      {
        url: 'https://shivid.co/Images/logo.png',
        width: 1200,
        height: 630,
        alt: 'خرید موفق دوره طراحی جواهرات',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'شوید-آموزش طراحی جواهرات | خرید موفق',
    description: 'خرید دوره طراحی جواهرات با موفقیت انجام شد! اکنون می‌توانید به محتوای آموزشی دسترسی پیدا کنید.',
    image: 'https://shivid.co/Images/logo.png',
  },
};

// Define the interface for purchased courses
interface PurchasedCourse {
  id: string;
  name: string;
  price: number;
  thumbnail: string;
  courseLink: string;
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const { orderId, purchaseDate, totalAmount, courseIds } = resolvedSearchParams;

  if (!orderId || !purchaseDate || !totalAmount || !courseIds) {
    return <div>خطا: اطلاعات ناقص است</div>;
  }

  const courseIdsString = Array.isArray(courseIds) ? courseIds.join(",") : courseIds;

  const connection = await getConnection();
  const [courseRows] = await connection.execute<RowDataPacket[]>(
    `SELECT id, title AS name, price, thumbnail FROM courses WHERE id IN (${courseIdsString
      .split(",")
      .map(() => "?")
      .join(",")})`,
    courseIdsString.split(",")
  );
  await connection.end();

  const courseid: PurchasedCourse[] = courseRows.map((course) => ({
    id: course.id.toString(),
    name: course.name,
    price: parseFloat(course.price),
    thumbnail: course.thumbnail || "https://picsum.photos/100/100",
    courseLink: `/StudyRoom/${course.id}`,
  }));

  return (
    <div>
      <Header />
      <PurchaseSuccess
        courseid={courseid}
        totalAmount={parseFloat(totalAmount as string)}
        purchaseDate={decodeURIComponent(purchaseDate as string)}
        orderCode={orderId as string}
      />
      <Footer />
    </div>
  );
}

export const revalidate = 3600;