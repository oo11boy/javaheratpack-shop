import { NextResponse } from 'next/server';

export function GET() {
  const robots = `
User-agent: *
Disallow: /
Allow: /$
Allow: /bloglist/
Allow: /courselist/
Sitemap: https://shivid.co/sitemap.xml
`;

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
