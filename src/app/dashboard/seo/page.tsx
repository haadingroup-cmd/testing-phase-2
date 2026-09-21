import { requireStaff } from "@/lib/auth";
import AuditWorkspace from "@/components/seo/AuditWorkspace";
export const metadata = {
  title: "SEO projects | HaadinGlobal",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";
export default async function SEOProjects() {
  await requireStaff();
  return <AuditWorkspace />;
}
