import "server-only";
import { query } from "@/lib/db";

export type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  tags: string[];
  read_time: string;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export async function getPublishedBlogs(): Promise<BlogPost[]> {
  try {
    const rows = await query<BlogPost>(
      "SELECT id, title, slug, excerpt, content, cover_image, tags, read_time, published, created_at, updated_at FROM blog_posts WHERE published = true ORDER BY created_at DESC"
    );
    return rows;
  } catch (err) {
    console.error("Error fetching published blogs:", err);
    return [];
  }
}

export async function getAllBlogs(): Promise<BlogPost[]> {
  try {
    const rows = await query<BlogPost>(
      "SELECT id, title, slug, excerpt, content, cover_image, tags, read_time, published, created_at, updated_at FROM blog_posts ORDER BY created_at DESC"
    );
    return rows;
  } catch (err) {
    console.error("Error fetching all blogs:", err);
    return [];
  }
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const rows = await query<BlogPost>(
      "SELECT id, title, slug, excerpt, content, cover_image, tags, read_time, published, created_at, updated_at FROM blog_posts WHERE slug = $1",
      [slug]
    );
    return rows[0] || null;
  } catch (err) {
    console.error("Error fetching blog by slug:", err);
    return null;
  }
}

export async function createBlog(data: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image?: string | null;
  tags?: string[];
  read_time?: string;
  published?: boolean;
}): Promise<BlogPost> {
  const tags = data.tags || [];
  const readTime = data.read_time || "4 min read";
  const published = data.published ?? true;

  const rows = await query<BlogPost>(
    `INSERT INTO blog_posts (title, slug, excerpt, content, cover_image, tags, read_time, published)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id, title, slug, excerpt, content, cover_image, tags, read_time, published, created_at, updated_at`,
    [
      data.title.trim(),
      data.slug.trim().toLowerCase(),
      data.excerpt.trim(),
      data.content.trim(),
      data.cover_image || null,
      tags,
      readTime,
      published,
    ]
  );
  return rows[0];
}

export async function updateBlog(
  id: number,
  data: Partial<{
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    cover_image: string | null;
    tags: string[];
    read_time: string;
    published: boolean;
  }>
): Promise<void> {
  const current = (await query<BlogPost>("SELECT * FROM blog_posts WHERE id = $1", [id]))[0];
  if (!current) throw new Error("Blog post not found");

  const title = data.title !== undefined ? data.title.trim() : current.title;
  const slug = data.slug !== undefined ? data.slug.trim().toLowerCase() : current.slug;
  const excerpt = data.excerpt !== undefined ? data.excerpt.trim() : current.excerpt;
  const content = data.content !== undefined ? data.content.trim() : current.content;
  const cover_image = data.cover_image !== undefined ? data.cover_image : current.cover_image;
  const tags = data.tags !== undefined ? data.tags : current.tags;
  const read_time = data.read_time !== undefined ? data.read_time : current.read_time;
  const published = data.published !== undefined ? data.published : current.published;

  await query(
    `UPDATE blog_posts SET
       title = $1,
       slug = $2,
       excerpt = $3,
       content = $4,
       cover_image = $5,
       tags = $6,
       read_time = $7,
       published = $8,
       updated_at = now()
     WHERE id = $9`,
    [title, slug, excerpt, content, cover_image, tags, read_time, published, id]
  );
}

export async function deleteBlog(id: number): Promise<void> {
  await query("DELETE FROM blog_posts WHERE id = $1", [id]);
}
