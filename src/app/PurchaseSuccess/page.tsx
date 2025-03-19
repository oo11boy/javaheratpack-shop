import Footer from "@/Components/Footer/Footer";
import Header from "@/Components/Header/Header";
import PurchaseSuccess from "@/Components/PurchaseSuccess/PurchaseSuccess";
const purchasedCourses = [
    { id: '1', name: 'پکیج شماره ۱', price: 7000000, thumbnail: 'https://picsum.photos/100/100?random=1', courseLink: '/course/1' },
    { id: '2', name: 'پکیج شماره ۲', price: 7000000, thumbnail: 'https://picsum.photos/100/100?random=2', courseLink: '/course/2' },
  ];

export default function page() {
  return (
    <div>
        <Header/>
    <PurchaseSuccess
  purchasedCourses={purchasedCourses}
  totalAmount={14000000}
  purchaseDate="۱۴۰۴/۰۱/۰۱ - ۱۲:۳۰"
  orderCode="ORD-123456"
/>
<Footer/>
    </div>
  )
}
