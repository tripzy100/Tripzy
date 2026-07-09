import { db } from "../lib/db";
async function main() {
  const vehicles = await db.vehicle.findMany({
    where: { deletedAt: null },
    include: { brand: true, model: true, city: true, pricings: true },
  });
  console.log("Query returned:", vehicles.length);
  for (const v of vehicles) {
    console.log(v.brand.name, v.model.name, "| city:", v.city?.name, "| pricings:", v.pricings.length);
  }
}
main();
