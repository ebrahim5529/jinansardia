const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const author = await prisma.user.findFirst({
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, email: true },
  });

  if (!author) {
    throw new Error("No user found in DB to set as blog author. Create a user first.");
  }

  const categorySlug = "reports";
  const category = await prisma.blogCategory.upsert({
    where: { slug: categorySlug },
    update: { name: "تقارير" },
    create: { name: "تقارير", slug: categorySlug },
  });

  const tagName = "supply-chain";
  const tag = await prisma.blogTag.upsert({
    where: { name: tagName },
    update: {},
    create: { name: tagName },
  });

  const slug = `welcome-${Date.now()}`;

  const post = await prisma.blogPost.create({
    data: {
      title: "مرحباً بكم في مدونة جنان سارديا",
      slug,
      excerpt: "مقال تجريبي للتأكد من عمل المدونة وعرض المقالات في الموقع.",
      content:
        "هذا محتوى مقال تجريبي.\n\nيمكنك الآن إدارة المقالات من لوحة تحكم الأدمن، وإنشاء/تعديل/حذف المقالات والتصنيفات والوسوم.",
      featuredImage: null,
      status: "published",
      publishedAt: new Date(),
      metaTitle: "مدونة جنان سارديا",
      metaDescription: "مقال تجريبي للتأكد من عمل المدونة.",
      keywords: "مدونة, تقارير, سلسلة الإمداد",
      canonicalUrl: null,
      authorId: author.id,
      categoryId: category.id,
      tags: {
        connect: [{ id: tag.id }],
      },
    },
    include: {
      category: true,
      tags: true,
      author: { select: { id: true, name: true, email: true } },
    },
  });

  console.log("author:", author);
  console.log("created_category:", category);
  console.log("created_tag:", tag);
  console.log("created_post:", { id: post.id, slug: post.slug, title: post.title, status: post.status });
}

main()
  .catch((e) => {
    console.error("Create blog post failed:", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
