import Footer from "@/Components/Footer/Footer";
import Header from "@/Components/Header/Header";
import PurchaseSuccess from "@/Components/PurchaseSuccess/PurchaseSuccess";
import { getConnection } from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";

interface PurchasedCourse {
  id: string;
  name: string;
  price: number;
  thumbnail: string;
  courseLink: string;
}

export default async function Page({ searchParams }: { searchParams: { [key: string]: string } }) {
  const { orderId, purchaseDate, totalAmount, courseIds } = searchParams;

  if (!orderId || !purchaseDate || !totalAmount || !courseIds) {
    return <div>خطا: اطلاعات ناقص است</div>;
  }

  // گرفتن اطلاعات دوره‌ها از دیتابیس
  const connection = await getConnection();
  const [courseRows] = await connection.execute<RowDataPacket[]>(
    `SELECT id, title AS name, price, thumbnail FROM courses WHERE id IN (${courseIds
      .split(",")
      .map(() => "?")
      .join(",")})`,
    courseIds.split(",")
  );
  await connection.end();

  const courseid: PurchasedCourse[] = courseRows.map((course) => ({
    id: course.id.toString(),
    name: course.name,
    price: parseFloat(course.price),
    thumbnail: course.thumbnail || "https://picsum.photos/100/100",
    courseLink: `/course/${course.id}`,
  }));

  return (
    <div>
      <Header />
      <PurchaseSuccess
        courseid={courseid}
        totalAmount={parseFloat(totalAmount)}
        purchaseDate={decodeURIComponent(purchaseDate)}
        orderCode={orderId}
      />
      <Footer />
    </div>
  );
}