// lib/types.ts
export interface Instructor {
  id: number;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  heroImage: string;
  phone: string;
  telegram: string;
  whatsapp: string;
  instagram: string;
}

export interface SyllabusItem {
  title: string;
  description: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  accessType: string;
  price: number;
  discountPrice?: number;
  introVideo: string;
  level:string,
  bannerImage: string;
  syllabus: SyllabusItem[];
  features: string[];
  prerequisites: string[];
  targetAudience: string[];
  category: string;
  thumbnail: string;
  instructor: Instructor;
  name: string;
  courseLink: string;
}

export interface SimpleCourse {
  id: number;
  title: string;
  description: string;
  duration: string;
  accessType: string | null;
  price: number;
  discountPrice: number | null;
  introVideo: string | null;
  level:string,
  bannerImage: string | null;
  features: string[];
  prerequisites: string[];
  targetAudience: string[];
  category: string;
  thumbnail: string;
}


export interface CourseVideo {
  id: string;
  title: string;
  url: string;
  duration?: string;
  description?: string;
  isCompleted?: boolean;
  courseid: number;
  place: number;

}


export interface UserData {
  id:number,
  name: string;
  lastname:string;
  email: string;
  phonenumber: string | null;
  avatar: string;
  purchasedCourses: Course[];
  completedCourses?: number;
  totalHours?: string;
}


export interface PurchasedCourse {

}
