import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const cities = await prisma.city.findMany();
  if (cities.length === 0) {
    console.log("No cities found. Please run main seed first.");
    return;
  }

  const ranchi = cities.find(c => c.name.toLowerCase().includes("airport") === false);
  const airport = cities.find(c => c.name.toLowerCase().includes("airport"));

  if (ranchi) {
    // Upsert Pickup Location
    const p1 = await prisma.pickupLocation.upsert({
      where: { id: "11111111-1111-1111-1111-111111111111" },
      update: {},
      create: {
        id: "11111111-1111-1111-1111-111111111111",
        cityId: ranchi.id,
        name: "Ranchi City Center",
        address: "Main Road, Near Ranchi Railway Station, Ranchi",
        latitude: 23.3441,
        longitude: 85.3096,
        isActive: true,
      },
    });

    // Upsert Drop Location
    const d1 = await prisma.dropLocation.upsert({
      where: { id: "22222222-2222-2222-2222-222222222222" },
      update: {},
      create: {
        id: "22222222-2222-2222-2222-222222222222",
        cityId: ranchi.id,
        name: "Ranchi City Center",
        address: "Main Road, Near Ranchi Railway Station, Ranchi",
        latitude: 23.3441,
        longitude: 85.3096,
        isActive: true,
      },
    });

    console.log("Seeded Ranchi City locations:", p1.name, d1.name);
  }

  if (airport) {
    const p2 = await prisma.pickupLocation.upsert({
      where: { id: "33333333-3333-3333-3333-333333333333" },
      update: {},
      create: {
        id: "33333333-3333-3333-3333-333333333333",
        cityId: airport.id,
        name: "Birsa Munda Airport (IXR)",
        address: "Airport Road, Hinoo, Ranchi",
        latitude: 23.3142,
        longitude: 85.3218,
        isAirport: true,
        isActive: true,
      },
    });

    const d2 = await prisma.dropLocation.upsert({
      where: { id: "44444444-4444-4444-4444-444444444444" },
      update: {},
      create: {
        id: "44444444-4444-4444-4444-444444444444",
        cityId: airport.id,
        name: "Birsa Munda Airport (IXR)",
        address: "Airport Road, Hinoo, Ranchi",
        latitude: 23.3142,
        longitude: 85.3218,
        isAirport: true,
        isActive: true,
      },
    });

    console.log("Seeded Ranchi Airport locations:", p2.name, d2.name);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
