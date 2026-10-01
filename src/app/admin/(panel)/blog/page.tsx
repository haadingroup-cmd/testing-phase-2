import Link from "next/link";
import { AdminTitle, Card, EmptyState, tableClass, tdClass, thClass } from "@/components/admin/bits";
import { getDb } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Blog" };

export default async function AdminBlog() {
  const posts = await getDb().blogPost.findMany({ orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }], select: { id: true, title: true, slug: true, status: true, category: true, publishedAt: true, featured: true } });
  return (
    <>
      <AdminTitle title="Blog posts" action={{ href: "/admin/blog/new", label: "New post" }} />
      {posts.length ? (
        <Card className="overflow-x-auto p-0">
          <table className={tableClass}>
            <thead><tr>{["Title", "Category", "Status", "Published", ""].map((h) => <th key={h} className={thClass}>{h}</th>)}</tr></thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="hover:bg-surface-container-low">
                  <td className={tdClass}><Link href={`/admin/blog/${p.id}`} className="font-semibold text-secondary hover:underline">{p.title}</Link>{p.featured ? " ★" : ""}</td>
                  <td className={tdClass}>{p.category}</td>
                  <td className={tdClass}>{p.status}</td>
                  <td className={tdClass}>{formatDate(p.publishedAt)}</td>
                  <td className={tdClass}>{p.status === "PUBLISHED" ? <a href={`/blog/${p.slug}`} target="_blank" className="text-secondary hover:underline">View</a> : null}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ) : <EmptyState message="No posts yet." />}
    </>
  );
}
