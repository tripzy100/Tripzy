import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  const locations = await prisma.pickupLocation.findMany();
  const dropLocations = await prisma.dropLocation.findMany();
  const cities = await prisma.city.findMany();
  const vehicles = await prisma.vehicle.findMany();

  console.log("--- DB STATS ---");
  console.log("Users:", users.length);
  console.log("Cities:", cities.map(c => c.name));
  console.log("Pickup Locations:", locations.map(l => l.name));
  console.log("Drop Locations:", dropLocations.map(l => l.name));
  console.log("Vehicles:", vehicles.length);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
