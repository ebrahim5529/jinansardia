const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const rows = await prisma.$queryRawUnsafe("SHOW TABLES");

  const tables = rows
    .map((r) => {
      const key = Object.keys(r)[0];
      return r[key];
    })
    .filter(Boolean)
    .sort();

  console.log("tables_count:", tables.length);
  console.log("tables:");
  for (const t of tables) console.log("-", t);
}

main()
  .catch((e) => {
    console.error("DB table listing failed:", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
