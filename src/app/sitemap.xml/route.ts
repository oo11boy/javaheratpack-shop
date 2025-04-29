import { getCourses, getArticles } from '@/lib/api';
import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://shivid.co';
  const now = new Date().toISOString();

  const courses = await getCourses();
  const articles = await getArticles();

  const staticUrls = [
    {
      loc: `${baseUrl}/`,
      priority: '1.0',
      lastmod: now,
    },
    {
      loc: `${baseUrl}/courselist`,
      priority: '0.9',
      lastmod: now,
    },
    {
      loc: `${baseUrl}/bloglist`,
      priority: '0.8',
      lastmod: now,
    },
  ];

  const courseUrls = courses.map(course => ({
    loc: `${baseUrl}/courselist/${course.id}`,
    priority: '0.7',
    lastmod: now, // یا course.updatedAt اگر داری
  }));

  const articleUrls = articles.map(article => ({
    loc: `${baseUrl}/bloglist/${article.id}`,
    priority: '0.6',
    lastmod: article.date, // مطمئن شو article.date به ISO فرمت شده باشه
  }));

  const urls = [...staticUrls, ...courseUrls, ...articleUrls];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ loc, priority, lastmod }) => `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>${priority}</priority>
  </url>`
  )
  .join('')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
