import Footer from "@/Components/Footer/Footer";
import Header from "@/Components/Header/Header";
import PurchaseSuccess from "@/Components/PurchaseSuccess/PurchaseSuccess";
import { getConnection } from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";

// Define the interface for purchased courses
interface PurchasedCourse {
  id: string;
  name: string;
  price: number;
  thumbnail: string;
  courseLink: string;
}

// Use the correct type for searchParams in a server component
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Await the searchParams since it's a Promise
  const resolvedSearchParams = await searchParams;
  const { orderId, purchaseDate, totalAmount, courseIds } = resolvedSearchParams;

  if (!orderId || !purchaseDate || !totalAmount || !courseIds) {
    return <div>خطا: اطلاعات ناقص است</div>;
  }

  // Ensure courseIds is a string (not an array or undefined)
  const courseIdsString = Array.isArray(courseIds) ? courseIds.join(",") : courseIds;

  // Fetch course data from the database
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