-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Apr 05, 2025 at 03:24 PM
-- Server version: 8.3.0
-- PHP Version: 8.1.2-1ubuntu2.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `javaheratnew1245`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `id` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `courseid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `vip` int NOT NULL,
  `phonenumber` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`id`, `email`, `name`, `lastname`, `courseid`, `vip`, `phonenumber`, `password`) VALUES
(1, 'test@gmail.com', 'rasoul', 'ghasemi', '5,6,7', 0, '09354502369', '$2a$12$t0vLmxbAgyzTRqSnUkMCAuFfFh8r.0Ds/zPxXLfbM2GbwJ7ueOZFG'),
(2, 'editkhone@gmail.com', 'رسول', 'قاسمی', '6,7,8', 0, '09354502369', '$2b$10$P3ucu3kWnlJmVZUfp75Ry.Bey6r6qkwIDw/PRNrpGh2b18obV.2GO'),
(3, 'unicodewebdesign@gmail.com', 'یونیکد', 'وب دیزاین', '6,7,15', 0, '09010196918', '$2b$10$y7rXp9P/JWo4.ZgggcYAGOjTMLqUr0.2WNzu6XxalNsCT8oJE0DT.');

-- --------------------------------------------------------

--
-- Table structure for table `articles`
--

CREATE TABLE `articles` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `excerpt` text,
  `category` varchar(100) DEFAULT NULL,
  `read_time` varchar(50) DEFAULT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `date` varchar(50) DEFAULT NULL,
  `author` varchar(100) DEFAULT NULL,
  `summary` text,
  `content` text,
  `hero_image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `articles`
--

INSERT INTO `articles` (`id`, `title`, `excerpt`, `category`, `read_time`, `thumbnail`, `date`, `author`, `summary`, `content`, `hero_image`, `created_at`, `updated_at`) VALUES
(5, 'چگونه برنامه‌نویس حرفه‌ای شویم', 'مراحل تبدیل شدن به یک برنامه‌نویس حرفه‌ای را بررسی می‌کنیم.', 'برنامه‌نویسی', '7 دقیقه', 'https://picsum.photos/300/200?random=1', '1403/12/25', 'علی رضایی', 'این مقاله راهنمای گام‌به‌گام برای تبدیل شدن به یک برنامه‌نویس حرفه‌ای است.', '<h1>چگونه برنامه‌نویس حرفه‌ای شویم</h1><p>برنامه‌نویسی یکی از مهارت‌های پرتقاضا در دنیای امروز است. در این مقاله، مراحل تبدیل شدن به یک برنامه‌نویس حرفه‌ای را بررسی می‌کنیم.</p><h2>مرحله اول: یادگیری اصول اولیه</h2><p>شروع با زبان‌های ساده مثل Python می‌تواند به شما کمک کند تا مفاهیم پایه را درک کنید.</p><img src=\"https://picsum.photos/800/400?random=1\" alt=\"کدنویسی با پایتون\" style=\"max-width: 100%;\"><h2>مرحله دوم: پروژه‌های عملی</h2><p>ساخت پروژه‌های کوچک مثل یک ماشین‌حساب یا وب‌سایت ساده، مهارت شما را تقویت می‌کند.</p><video controls src=\"https://example.com/sample-video1.mp4\" style=\"max-width: 100%;\"></video><p>در این ویدیو، یک پروژه ساده را مرحله به مرحله می‌سازیم.</p>', 'https://picsum.photos/1200/600?random=1', '2025-03-23 13:58:03', '2025-03-23 13:58:03'),
(6, 'آینده طراحی رابط کاربری در 2025', 'نگاهی به روندهای آینده طراحی رابط کاربری.', 'طراحی', '6 دقیقه', 'https://picsum.photos/300/200?random=2', '1403/12/20', 'سارا حسینی', 'این مقاله به بررسی تأثیر تکنولوژی بر طراحی رابط کاربری در سال 2025 می‌پردازد.', '<h1>آینده طراحی رابط کاربری در 2025</h1><p>طراحی رابط کاربری (UI) با پیشرفت تکنولوژی در حال تغییر است. این مقاله نگاهی به روندهای آینده دارد.</p><h2>تأثیر هوش مصنوعی بر UI</h2><p>ابزارهای مبتنی بر AI مثل Figma به طراحان کمک می‌کنند تا سریع‌تر کار کنند.</p><img src=\"https://picsum.photos/800/400?random=2\" alt=\"طراحی با هوش مصنوعی\" style=\"max-width: 100%;\"><h2>واقعیت افزوده در طراحی</h2><p>استفاده از AR در اپلیکیشن‌ها، تجربه کاربری را جذاب‌تر می‌کند.</p><video controls src=\"https://example.com/sample-video2.mp4\" style=\"max-width: 100%;\"></video><p>این ویدیو نمونه‌ای از طراحی AR را نشان می‌دهد.</p>', 'https://picsum.photos/1200/600?random=2', '2025-03-23 13:58:03', '2025-03-23 13:58:03'),
(7, 'بهینه‌سازی وب‌سایت برای سرعت بیشتر', 'راهکارهایی برای افزایش سرعت بارگذاری وب‌سایت.', 'توسعه وب', '8 دقیقه', 'https://picsum.photos/300/200?random=3', '1403/12/15', 'محمد احمدی', 'این مقاله تکنیک‌هایی برای بهینه‌سازی سرعت وب‌سایت ارائه می‌دهد.', '<h1>بهینه‌سازی وب‌سایت برای سرعت بیشتر</h1><p>سرعت بارگذاری وب‌سایت یکی از عوامل مهم در تجربه کاربری و سئو است. در این مقاله، روش‌هایی برای بهبود آن را بررسی می‌کنیم.</p><h2>کاهش حجم تصاویر</h2><p>استفاده از فرمت‌های بهینه مثل WebP می‌تواند زمان بارگذاری را کاهش دهد.</p><img src=\"https://picsum.photos/800/400?random=3\" alt=\"تصویر بهینه‌شده\" style=\"max-width: 100%;\"><h2>استفاده از کش مرورگر</h2><p>تنظیم هدرهای کش می‌تواند بارگذاری صفحات را سریع‌تر کند.</p><video controls src=\"https://example.com/sample-video3.mp4\" style=\"max-width: 100%;\"></video><p>این ویدیو نحوه تنظیم کش را توضیح می‌دهد.</p>', 'https://picsum.photos/1200/600?random=3', '2025-03-23 13:58:03', '2025-03-23 13:58:03');

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` int NOT NULL,
  `article_id` int NOT NULL,
  `author` varchar(100) NOT NULL,
  `text` text NOT NULL,
  `date` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` enum('active','inactive') DEFAULT 'inactive'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `article_id`, `author`, `text`, `date`, `created_at`, `updated_at`, `status`) VALUES
(5, 5, 'رسول قاسمی', 'عالی', '۱۴۰۴/۱/۳', '2025-03-23 14:06:59', '2025-03-23 14:07:21', 'active'),
(6, 6, 'رضا علیمی', 'مقاله مفیدی بود', '۱۴۰۴/۱/۳', '2025-03-23 14:14:06', '2025-03-24 09:44:07', 'active'),
(7, 5, 'نیما سبحانی', 'جالب بود', '۱۴۰۴/۱/۳', '2025-03-23 14:14:44', '2025-03-23 14:14:44', 'inactive');

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `duration` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `accessType` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `discountPrice` decimal(10,2) DEFAULT NULL,
  `introVideo` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `level` varchar(244) COLLATE utf8mb4_general_ci NOT NULL,
  `bannerImage` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `features` text COLLATE utf8mb4_general_ci,
  `prerequisites` text COLLATE utf8mb4_general_ci,
  `targetAudience` text COLLATE utf8mb4_general_ci,
  `category` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `thumbnail` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `instructorID` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `title`, `description`, `duration`, `accessType`, `price`, `discountPrice`, `introVideo`, `level`, `bannerImage`, `features`, `prerequisites`, `targetAudience`, `category`, `thumbnail`, `instructorID`) VALUES
(6, 'دوره جامع طراحی جواهرات مدرن', 'این دوره شما را با تکنیک‌های پیشرفته طراحی جواهرات آشنا می‌کند و از صفر تا صد، از ایده‌پردازی تا اجرا، همراه شماست. چه مبتدی باشید چه حرفه‌ای، این دوره به شما کمک می‌کند تا خلاقیت خود را به آثار هنری تبدیل کنید. در این دوره مهارت‌های طراحی دستی، کار با نرم‌افزارهای تخصصی و تکنیک‌های ساخت را خواهید آموخت.', '۸ هفته (۴۸ ساعت)', 'آنلاین و آفلاین (دسترسی مادام‌العمر)', 2500000.00, 2000000.00, 'https://media.istockphoto.com/id/1413207061/fr/vid%C3%A9o/circulation-routi%C3%A8re-dans-delhi-roads.mp4?s=mp4-640x640-is&k=20&c=k8fkmGZJ8GQVJdP6BL0VdYCMtI78VolF5oqyCcYeAjw=', 'پیشرفته', '', 'پشتیبانی اختصاصی توسط مدرس,پروژه‌های عملی و واقعی,گواهینامه معتبر پایان دوره,دسترسی به انجمن اختصاصی هنرجویان', 'علاقه به طراحی,آشنایی اولیه با کامپیوتر,بدون نیاز به تجربه قبلی', 'علاقمندان به طراحی جواهرات,طراحان مبتدی و حرفه‌ای,کارآفرینان حوزه مد و هنر', 'طراحی', 'https://picsum.photos/300/200?random=6', 2),
(7, 'دوره جامع طراحی جواهرات مدرن متوسط', 'این دوره شما را با تکنیک‌های پیشرفته طراحی جواهرات آشنا می‌کند و از صفر تا صد، از ایده‌پردازی تا اجرا، همراه شماست. چه مبتدی باشید چه حرفه‌ای، این دوره به شما کمک می‌کند تا خلاقیت خود را به آثار هنری تبدیل کنید. در این دوره مهارت‌های طراحی دستی، کار با نرم‌افزارهای تخصصی و تکنیک‌های ساخت را خواهید آموخت.', '۸ هفته (۴۸ ساعت)', 'آنلاین و آفلاین (دسترسی مادام‌العمر)', 2500000.00, 2000000.00, 'https://media.istockphoto.com/id/1413207061/fr/vid%C3%A9o/circulation-routi%C3%A8re-dans-delhi-roads.mp4?s=mp4-640x640-is&k=20&c=k8fkmGZJ8GQVJdP6BL0VdYCMtI78VolF5oqyCcYeAjw=', 'پیشرفته', '', 'پشتیبانی اختصاصی توسط مدرس,پروژه‌های عملی و واقعی,گواهینامه معتبر پایان دوره,دسترسی به انجمن اختصاصی هنرجویان', 'علاقه به طراحی,آشنایی اولیه با کامپیوتر,بدون نیاز به تجربه قبلی', 'علاقمندان به طراحی جواهرات,طراحان مبتدی و حرفه‌ای,کارآفرینان حوزه مد و هنر', 'جواهرات', 'https://picsum.photos/300/200?random=5', 2),
(8, 'دوره جامع طراحی جواهرات مدرن پیشرفته', 'این دوره شما را با تکنیک‌های پیشرفته طراحی جواهرات آشنا می‌کند و از صفر تا صد، از ایده‌پردازی تا اجرا، همراه شماست. چه مبتدی باشید چه حرفه‌ای، این دوره به شما کمک می‌کند تا خلاقیت خود را به آثار هنری تبدیل کنید. در این دوره مهارت‌های طراحی دستی، کار با نرم‌افزارهای تخصصی و تکنیک‌های ساخت را خواهید آموخت.', '۸ هفته (۴۸ ساعت)', 'آنلاین و آفلاین (دسترسی مادام‌العمر)', 2500000.00, 2000000.00, 'https://media.istockphoto.com/id/1413207061/fr/vid%C3%A9o/circulation-routi%C3%A8re-dans-delhi-roads.mp4?s=mp4-640x640-is&k=20&c=k8fkmGZJ8GQVJdP6BL0VdYCMtI78VolF5oqyCcYeAjw=', 'پیشرفته', '', 'پشتیبانی اختصاصی توسط مدرس,پروژه‌های عملی و واقعی,گواهینامه معتبر پایان دوره,دسترسی به انجمن اختصاصی هنرجویان', 'علاقه به طراحی,آشنایی اولیه با کامپیوتر,بدون نیاز به تجربه قبلی', 'علاقمندان به طراحی جواهرات,طراحان مبتدی و حرفه‌ای,کارآفرینان حوزه مد و هنر', 'جواهرات', 'https://picsum.photos/300/200?random=7', 2),
(15, 'دوره جامع طراحی جواهرات مدرن پیشرفته', 'این دوره شما را با تکنیک‌های پیشرفته طراحی جواهرات آشنا می‌کند و از صفر تا صد، از ایده‌پردازی تا اجرا، همراه شماست. چه مبتدی باشید چه حرفه‌ای، این دوره به شما کمک می‌کند تا خلاقیت خود را به آثار هنری تبدیل کنید. در این دوره مهارت‌های طراحی دستی، کار با نرم‌افزارهای تخصصی و تکنیک‌های ساخت را خواهید آموخت.', '۸ هفته (۴۸ ساعت)', 'آنلاین و آفلاین (دسترسی مادام‌العمر)', 2500000.00, 2000000.00, 'https://media.istockphoto.com/id/1413207061/fr/vid%C3%A9o/circulation-routi%C3%A8re-dans-delhi-roads.mp4?s=mp4-640x640-is&k=20&c=k8fkmGZJ8GQVJdP6BL0VdYCMtI78VolF5oqyCcYeAjw=', 'پیشرفته', '', 'پشتیبانی اختصاصی توسط مدرس,پروژه‌های عملی و واقعی,گواهینامه معتبر پایان دوره,دسترسی به انجمن اختصاصی هنرجویان', 'علاقه به طراحی,آشنایی اولیه با کامپیوتر,بدون نیاز به تجربه قبلی', 'علاقمندان به طراحی جواهرات,طراحان مبتدی و حرفه‌ای,کارآفرینان حوزه مد و هنر', 'جواهرات', 'https://picsum.photos/300/200?random=7', 2);

-- --------------------------------------------------------

--
-- Table structure for table `instructors`
--

CREATE TABLE `instructors` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `bio` text COLLATE utf8mb4_general_ci,
  `avatar` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `heroImage` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `telegram` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `whatsapp` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `instagram` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `instructors`
--

INSERT INTO `instructors` (`id`, `name`, `bio`, `avatar`, `title`, `heroImage`, `phone`, `telegram`, `whatsapp`, `instagram`) VALUES
(2, 'نازنین مقدم', 'نازنین جواهری، هنرمند و مدرس برجسته طراحی جواهرات با بیش از 15 سال تجربه در خلق آثار بی‌نظیر و آموزش هنرجویان مشتاق.', 'https://picsum.photos/300?random=1', 'مدرس طراحی جواهرات', 'https://picsum.photos/1200/600?random=2', '0912-345-6789', '@NazaninJavahri', '+989123456789', '@nazanin.javahri');

-- --------------------------------------------------------

--
-- Table structure for table `nemone`
--

CREATE TABLE `nemone` (
  `id` int NOT NULL,
  `src` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nemone`
--

INSERT INTO `nemone` (`id`, `src`, `created_at`) VALUES
(1, 'https://picsum.photos/300/300?random=1', '2025-03-23 14:42:29'),
(2, 'https://picsum.photos/300/300?random=2', '2025-03-23 14:42:29'),
(3, 'https://picsum.photos/300/300?random=3', '2025-03-23 14:42:29'),
(4, 'https://picsum.photos/300/300?random=4', '2025-03-23 14:42:29'),
(5, 'https://picsum.photos/300/300?random=5', '2025-03-23 14:42:29'),
(6, 'https://picsum.photos/300/300?random=6', '2025-03-23 14:42:29'),
(7, 'https://picsum.photos/300/300?random=7', '2025-03-23 14:42:29'),
(8, 'https://picsum.photos/300/300?random=8', '2025-03-23 14:42:29'),
(9, 'https://picsum.photos/300/300?random=9', '2025-03-23 14:42:29');

-- --------------------------------------------------------

--
-- Table structure for table `pending_payments`
--

CREATE TABLE `pending_payments` (
  `id` int NOT NULL,
  `track_id` varchar(50) DEFAULT NULL,
  `order_id` varchar(50) NOT NULL,
  `user_id` int DEFAULT NULL,
  `amount` decimal(15,2) NOT NULL,
  `purchased_courses` json NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pending_payments`
--

INSERT INTO `pending_payments` (`id`, `track_id`, `order_id`, `user_id`, `amount`, `purchased_courses`, `created_at`) VALUES
(11, '4022954624', 'ORD-1742639180629', NULL, 2500000.00, '[{\"id\": 6, \"name\": \"دوره جامع طراحی جواهرات مدرن\", \"price\": 2500000, \"thumbnail\": \"https://picsum.photos/300/200?random=6\", \"courseLink\": \"/course/6\"}]', '2025-03-22 10:26:25');

-- --------------------------------------------------------

--
-- Table structure for table `syllabus`
--

CREATE TABLE `syllabus` (
  `id` int NOT NULL,
  `courseID` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `syllabus`
--

INSERT INTO `syllabus` (`id`, `courseID`, `title`, `description`) VALUES
(1, 6, 'مقدمه‌ای بر طراحی جواهرات', 'آشنایی با مفاهیم پایه و ابزارها.'),
(2, 6, 'طراحی با نرم‌افزار', 'آموزش رندرینگ و مدل‌سازی سه‌بعدی.'),
(3, 6, 'ساخت و اجرا', 'مراحل عملی ساخت جواهرات.'),
(4, 6, 'بازاریابی آثار', 'چگونه جواهرات خود را به بازار عرضه کنید.');

-- --------------------------------------------------------

--
-- Table structure for table `videocourse`
--

CREATE TABLE `videocourse` (
  `id` int NOT NULL,
  `place` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `url` varchar(560) COLLATE utf8mb4_general_ci NOT NULL,
  `duration` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci NOT NULL,
  `isCompleted` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'false',
  `courseId` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `videocourse`
--

INSERT INTO `videocourse` (`id`, `place`, `title`, `url`, `duration`, `description`, `isCompleted`, `courseId`) VALUES
(1, 0, 'مقدمه دوره', 'https://media.istockphoto.com/id/2185164247/fr/vid%C3%A9o/big-data-et-ia-titre-sur-le-titre-dun-journal.mp4?s=mp4-640x640-is&k=20&c=qHymLqIbtWRIObe8Su3h7dWE8-wMTf_bVis1g12rSJs=', '12:33', 'آشنایی با مفاهیم اولیه دوره', '0', 6),
(2, 0, 'جلسه اول: مفاهیم پایه', 'https://media.istockphoto.com/id/1413207061/fr/vid%C3%A9o/circulation-routi%C3%A8re-dans-delhi-roads.mp4?s=mp4-640x640-is&k=20&c=k8fkmGZJ8GQVJdP6BL0VdYCMtI78VolF5oqyCcYeAjw=', '14:52', 'بررسی اصول و مبانی اولیه', '0', 6),
(3, 0, 'جلسه دوم: پیشرفته', 'https://persian19.cdn.asset.aparat.com/aparat-video/6402b1f7f90f14357f0e6e3798eb163463716329-360p.mp4?wmsAuthSign=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImFkODNmMWIyMDdhMDcyM2JmYTFmN2IxYjU2YzM2OTc0IiwiZXhwIjoxNzQyMzMyMjQyLCJpc3MiOiJTYWJhIElkZWEgR1NJRyJ9.cJ5vTZQPLGhpO8nDag3497rcyRDWgktFYH3VHuKp8yk', '52:44', 'مباحث پیشرفته و کاربردی', '0', 7);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_category` (`category`),
  ADD KEY `idx_date` (`date`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_article_id` (`article_id`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `instructorID` (`instructorID`);

--
-- Indexes for table `instructors`
--
ALTER TABLE `instructors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `nemone`
--
ALTER TABLE `nemone`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_id` (`id`);

--
-- Indexes for table `pending_payments`
--
ALTER TABLE `pending_payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `track_id` (`track_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `syllabus`
--
ALTER TABLE `syllabus`
  ADD PRIMARY KEY (`id`),
  ADD KEY `courseID` (`courseID`);

--
-- Indexes for table `videocourse`
--
ALTER TABLE `videocourse`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `articles`
--
ALTER TABLE `articles`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `instructors`
--
ALTER TABLE `instructors`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `nemone`
--
ALTER TABLE `nemone`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `pending_payments`
--
ALTER TABLE `pending_payments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `syllabus`
--
ALTER TABLE `syllabus`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `videocourse`
--
ALTER TABLE `videocourse`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`instructorID`) REFERENCES `instructors` (`id`);

--
-- Constraints for table `pending_payments`
--
ALTER TABLE `pending_payments`
  ADD CONSTRAINT `pending_payments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `accounts` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `syllabus`
--
ALTER TABLE `syllabus`
  ADD CONSTRAINT `syllabus_ibfk_1` FOREIGN KEY (`courseID`) REFERENCES `courses` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
