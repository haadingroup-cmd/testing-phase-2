import { getBlogPosts } from "@/lib/data";
import { ok } from "@/lib/security/request";

export const revalidate = 300;

/** GET /api/blog — published posts (without full content). */
export async function GET() {
  const posts = await getBlogPosts();
  return ok(posts.map(({ content: _content, ...rest }) => rest));
}
