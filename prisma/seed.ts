/**
 * Seeds initial content. Safe to run repeatedly: existing rows are left
 * untouched (create-only), so edits made in /admin are never overwritten.
 *
 * Seeds: services, pricing plans, general FAQs, site settings, the existing
 * blog articles and case studies built from real project data. No
 * testimonials or invented results are seeded.
 *
 * Admin user: created only when ADMIN_EMAIL and ADMIN_PASSWORD are set.
 */
import { createScriptClient } from "./client";
import { hashPassword, passwordProblem } from "../src/lib/auth/password";
import { DEFAULT_SERVICES } from "../src/content/services";
import { DEFAULT_PRICING_PLANS } from "../src/content/pricing";
import { DEFAULT_FAQS } from "../src/content/faqs";
import { DEFAULT_SETTINGS } from "../src/content/settings";
import { DEFAULT_BLOG_POSTS } from "../src/content/blog";
import { CASE_STUDIES } from "../src/content/case-studies";

const db = createScriptClient();

async function main() {
  let created = 0;

  for (const s of DEFAULT_SERVICES) {
    const exists = await db.service.findUnique({ where: { slug: s.slug } });
    if (exists) continue;
    await db.service.create({ data: { ...s, process: s.process, faqs: s.faqs, published: true } });
    created++;
  }
  console.log(`Services: ${created} created`);

  created = 0;
  for (const p of DEFAULT_PRICING_PLANS) {
    if (await db.pricingPlan.findUnique({ where: { slug: p.slug } })) continue;
    await db.pricingPlan.create({ data: { ...p, published: true } });
    created++;
  }
  console.log(`Pricing plans: ${created} created`);

  if ((await db.fAQ.count()) === 0) {
    await db.fAQ.createMany({ data: DEFAULT_FAQS.map(({ question, answer, category, sortOrder }) => ({ question, answer, category, sortOrder })) });
    console.log(`FAQs: ${DEFAULT_FAQS.length} created`);
  } else {
    console.log("FAQs: already present, skipped");
  }

  const settings = await db.siteSetting.findUnique({ where: { key: "general" } });
  if (!settings) {
    await db.siteSetting.create({ data: { key: "general", value: DEFAULT_SETTINGS } });
    console.log("Site settings: created");
  }

  created = 0;
  for (const post of DEFAULT_BLOG_POSTS) {
    if (await db.blogPost.findUnique({ where: { slug: post.slug } })) continue;
    await db.blogPost.create({
      data: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage,
        category: post.category,
        tags: post.tags,
        author: post.author,
        readTime: post.readTime,
        featured: post.featured,
        status: "PUBLISHED",
        publishedAt: post.publishedAt ? new Date(post.publishedAt) : new Date(),
      },
    });
    created++;
  }
  console.log(`Blog posts: ${created} created`);

  created = 0;
  for (const c of CASE_STUDIES) {
    if (await db.caseStudy.findUnique({ where: { slug: c.slug } })) continue;
    const { beforeAfter, ...rest } = c;
    await db.caseStudy.create({ data: { ...rest, metrics: c.metrics, gallery: c.gallery, ...(beforeAfter ? { beforeAfter } : {}), published: true } });
    created++;
  }
  console.log(`Case studies: ${created} created`);

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    if (await db.user.findUnique({ where: { email } })) {
      console.log(`Admin ${email}: already exists, skipped`);
    } else {
      const problem = passwordProblem(password);
      if (problem) throw new Error(`ADMIN_PASSWORD: ${problem}`);
      await db.user.create({ data: { email, name: "Administrator", passwordHash: await hashPassword(password) } });
      console.log(`Admin ${email}: created`);
    }
  } else {
    console.log("Admin: ADMIN_EMAIL / ADMIN_PASSWORD not set — run `npm run admin:create` to add one.");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
