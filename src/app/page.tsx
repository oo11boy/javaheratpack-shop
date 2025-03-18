
import ArticleSlider from "@/Components/ArticlesSlider/ArticlesSlider";
import Doreha from "@/Components/Doreha/Doreha";
import Footer from "@/Components/Footer/Footer";
import Header from "@/Components/Header/Header";
import HeroSection from "@/Components/HeroSection/HeroSection";
import Nemone from "@/Components/Nemone/Nemone";

export default function page() {
  return (
  <>
  <Header/>
  <HeroSection/>

  <Nemone/>
  {/* <SocialBox/> */}
  <Doreha/>
<ArticleSlider/>
  <Footer/>
  </>
  )
}
