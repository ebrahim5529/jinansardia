const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.admin.findUnique({
    where: { email: "admin@jinansardia.com" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const counts = await prisma.$transaction([
    prisma.admin.count(),
    prisma.user.count(),
    prisma.country.count(),
    prisma.warehouse.count(),
    prisma.product.count(),
  ]);

  console.log("admin:", admin);
  console.log("counts [admin,user,country,warehouse,product]:", counts);
}

main()
  .catch((e) => {
    console.error("DB check failed:", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
