import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function createSeedData() {
  await prisma.staff.deleteMany();

  await prisma.staff.createMany({
    data: [
      {
        name: "山田太郎",
        position: "社員",
        hiredAt: new Date("2020-04-01"),
      },
      {
        name: "佐藤花子",
        position: "アルバイト",
        hiredAt: new Date("2022-04-01"),
      },
      {
        name: "鈴木一郎",
        position: "アルバイト",
        hiredAt: new Date("2022-05-01"),
      },
      {
        name: "田中美咲",
      },
      {
        name: "高橋健太",
        hiredAt: new Date("2023-05-01"),
      },
    ],
  });
}

createSeedData()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
