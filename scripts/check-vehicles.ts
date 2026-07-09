import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
async function main() {
  const vehicles = await p.vehicle.findMany({
    include: { brand: true, model: true },
  });
  console.log("Total vehicles:", vehicles.length);
  for (const v of vehicles) {
    console.log(v.brand.name, v.model.name, "| status:", v.status, "| deletedAt:", v.deletedAt);
  }
  await p.$disconnect();
}
main();
