import { db } from "../../lib/db";

async function main() {
  console.log("🌱 Database seeding initialization...");

  // 1. Seed Roles
  console.log("  - Seeding Roles...");
  const adminRole = await db.role.upsert({
    where: { code: "ADMIN" },
    update: {},
    create: {
      name: "Administrator",
      code: "ADMIN",
      description: "Root platform administrator with full access controls.",
    },
  });

  const userRole = await db.role.upsert({
    where: { code: "USER" },
    update: {},
    create: {
      name: "Customer",
      code: "USER",
      description: "Standard retail platform consumer.",
    },
  });

  const supportRole = await db.role.upsert({
    where: { code: "SUPPORT" },
    update: {},
    create: {
      name: "Support Agent",
      code: "SUPPORT",
      description: "Customer service and vehicle coordinator agent.",
    },
  });

  // 2. Seed Permissions
  console.log("  - Seeding Permissions...");
  const permissionsData = [
    { code: "USER_READ", name: "Read Users", description: "View client listings and profiles." },
    {
      code: "USER_WRITE",
      name: "Manage Users",
      description: "Modify client records and KYC states.",
    },
    {
      code: "VEHICLE_READ",
      name: "Read Vehicles",
      description: "Browse and inspect vehicle metrics.",
    },
    {
      code: "VEHICLE_WRITE",
      name: "Manage Vehicles",
      description: "Modify inventory details, prices, and calendars.",
    },
    {
      code: "BOOKING_READ",
      name: "Read Bookings",
      description: "View booking transaction ledgers.",
    },
    {
      code: "BOOKING_WRITE",
      name: "Manage Bookings",
      description: "Edit, extend, or reject reservation requests.",
    },
    { code: "PAYMENT_READ", name: "Read Payments", description: "View transactional invoices." },
    {
      code: "SETTINGS_WRITE",
      name: "Manage Settings",
      description: "Update global business parameters.",
    },
  ];

  const permissionsMap = new Map<string, any>();
  for (const perm of permissionsData) {
    const createdPerm = await db.permission.upsert({
      where: { code: perm.code },
      update: {},
      create: perm,
    });
    permissionsMap.set(perm.code, createdPerm);
  }

  // 3. Associate Permissions to Admin Role
  console.log("  - Mapping permissions to Roles...");
  for (const perm of permissionsMap.values()) {
    await db.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: perm.id,
      },
    });
  }

  // 4. Seed Countries, States, and Cities
  console.log("  - Seeding Geographies...");
  const country = await db.country.upsert({
    where: { code: "IN" },
    update: {},
    create: {
      name: "India",
      code: "IN",
      phoneCode: "+91",
    },
  });

  const stateJH = await db.state.create({
    data: {
      countryId: country.id,
      name: "Jharkhand",
      code: "JH",
    },
  });

  const cityRanchi = await db.city.create({
    data: {
      stateId: stateJH.id,
      name: "Ranchi",
      code: "RNC",
      isActive: true,
    },
  });

  const cityRanchiAirport = await db.city.create({
    data: {
      stateId: stateJH.id,
      name: "Ranchi Airport",
      code: "IXR",
      isActive: true,
    },
  });

  // 5. Seed Vehicle Categories
  console.log("  - Seeding Categories...");
  const categories = [
    { name: "Sedan", slug: "sedan", description: "Comfortable standard passenger vehicles." },
    { name: "SUV", slug: "suv", description: "Spacious utility sport utility vehicles." },
    { name: "Hatchback", slug: "hatchback", description: "Compact city cruisers." },
    { name: "Electric", slug: "electric", description: "Zero-emission next-gen vehicles." },
  ];

  for (const cat of categories) {
    await db.vehicleCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  // 6. Seed System Settings
  console.log("  - Seeding System Settings...");
  const settings = [
    {
      key: "SITE_ACTIVE",
      value: "true",
      type: "BOOLEAN",
      description: "Global platform operational state.",
    },
    {
      key: "DEFAULT_TAX_RATE",
      value: "18.0",
      type: "NUMBER",
      description: "Standard default tax percentage.",
    },
    {
      key: "MAINTENANCE_MODE",
      value: "false",
      type: "BOOLEAN",
      description: "Redirect traffic to maintenance view.",
    },
    {
      key: "BASE_CURRENCY",
      value: "INR",
      type: "STRING",
      description: "Platform base transaction currency.",
    },
  ];

  for (const set of settings) {
    await db.systemSetting.upsert({
      where: { key: set.key },
      update: {},
      create: {
        key: set.key,
        value: set.value,
        type: set.type as any,
        description: set.description,
      },
    });
  }

  // 7. Seed FAQs
  console.log("  - Seeding FAQs...");
  const faqs = [
    {
      question: "What documents are required to book a car?",
      answer:
        "A valid original driving license and an official national identity card (like Aadhar card or Passport) are required to complete KYC checks.",
      category: "KYC & Verification",
      sortOrder: 1,
    },
    {
      question: "Is there a security deposit requirement?",
      answer:
        "Yes, a fully refundable security deposit is hold-captured at checkout. It is refunded within 5-7 business days of safe vehicle return.",
      category: "Billing & Refund",
      sortOrder: 2,
    },
    {
      question: "What is the fuel policy?",
      answer:
        "We support a like-to-like policy. The vehicle should be returned with the same fuel level as it was at the time of pickup.",
      category: "Usage Rules",
      sortOrder: 3,
    },
  ];

  for (const faq of faqs) {
    await db.faq.create({
      data: faq,
    });
  }

  // 8. Seed 14 Real Vehicles
  console.log("  - Cleaning existing inventory...");
  await db.vehiclePricing.deleteMany({});
  await db.vehicle.deleteMany({});
  await db.vehicleVariant.deleteMany({});
  await db.vehicleModel.deleteMany({});
  await db.vehicleBrand.deleteMany({});

  console.log("  - Seeding 14 Real Vehicles...");
  const defaultCity = await db.city.findFirst();
  if (!defaultCity) throw new Error("City not found for seeding");

  const vehicleData = [
    {
      name: "Maruti Suzuki Swift",
      slug: "maruti-suzuki-swift",
      brand: "Maruti Suzuki",
      model: "Swift",
      category: "Hatchback",
      transmission: "MANUAL",
      fuel: "PETROL",
      seats: 5,
      price: 1800,
    },
    {
      name: "Maruti Suzuki Swift Dzire",
      slug: "maruti-suzuki-swift-dzire",
      brand: "Maruti Suzuki",
      model: "Swift Dzire",
      category: "Sedan",
      transmission: "MANUAL",
      fuel: "PETROL",
      seats: 5,
      price: 2000,
    },
    {
      name: "Maruti Suzuki Baleno",
      slug: "maruti-suzuki-baleno",
      brand: "Maruti Suzuki",
      model: "Baleno",
      category: "Premium Hatchback",
      transmission: "MANUAL",
      fuel: "PETROL",
      seats: 5,
      price: 2200,
    },
    {
      name: "Toyota Glanza",
      slug: "toyota-glanza",
      brand: "Toyota",
      model: "Glanza",
      category: "Premium Hatchback",
      transmission: "MANUAL",
      fuel: "PETROL",
      seats: 5,
      price: 2200,
    },
    {
      name: "Citroen C3",
      slug: "citroen-c3",
      brand: "Citroen",
      model: "C3",
      category: "Hatchback",
      transmission: "MANUAL",
      fuel: "PETROL",
      seats: 5,
      price: 2200,
    },
    {
      name: "Hyundai i20",
      slug: "hyundai-i20",
      brand: "Hyundai",
      model: "i20",
      category: "Premium Hatchback",
      transmission: "MANUAL",
      fuel: "PETROL",
      seats: 5,
      price: 2800,
    },
    {
      name: "Maruti Suzuki Fronx",
      slug: "maruti-suzuki-fronx",
      brand: "Maruti Suzuki",
      model: "Fronx",
      category: "Compact SUV",
      transmission: "MANUAL",
      fuel: "PETROL",
      seats: 5,
      price: 3000,
    },
    {
      name: "Maruti Suzuki Grand Vitara",
      slug: "maruti-suzuki-grand-vitara",
      brand: "Maruti Suzuki",
      model: "Grand Vitara",
      category: "SUV",
      transmission: "MANUAL",
      fuel: "PETROL",
      seats: 5,
      price: 4000,
    },
    {
      name: "Hyundai Verna",
      slug: "hyundai-verna",
      brand: "Hyundai",
      model: "Verna",
      category: "Sedan",
      transmission: "MANUAL",
      fuel: "PETROL",
      seats: 5,
      price: 4500,
    },
    {
      name: "Mahindra Thar",
      slug: "mahindra-thar",
      brand: "Mahindra",
      model: "Thar",
      category: "SUV",
      transmission: "MANUAL",
      fuel: "DIESEL",
      seats: 4,
      price: 5000,
    },
    {
      name: "Mahindra Scorpio S11",
      slug: "mahindra-scorpio-s11",
      brand: "Mahindra",
      model: "Scorpio S11",
      category: "SUV",
      transmission: "MANUAL",
      fuel: "DIESEL",
      seats: 7,
      price: 5500,
    },
    {
      name: "Mahindra Scorpio N",
      slug: "mahindra-scorpio-n",
      brand: "Mahindra",
      model: "Scorpio N",
      category: "SUV",
      transmission: "MANUAL",
      fuel: "DIESEL",
      seats: 7,
      price: 6500,
    },
    {
      name: "Mahindra Thar Roxx",
      slug: "mahindra-thar-roxx",
      brand: "Mahindra",
      model: "Thar Roxx",
      category: "SUV",
      transmission: "MANUAL",
      fuel: "DIESEL",
      seats: 5,
      price: 7000,
    },
    {
      name: "Tata Safari",
      slug: "tata-safari",
      brand: "Tata",
      model: "Safari",
      category: "SUV",
      transmission: "MANUAL",
      fuel: "DIESEL",
      seats: 7,
      price: 7000,
    },
  ];

  for (const item of vehicleData) {
    const category = await db.vehicleCategory.upsert({
      where: { slug: item.category.toLowerCase().replace(/\s+/g, "-") },
      update: {},
      create: {
        name: item.category,
        slug: item.category.toLowerCase().replace(/\s+/g, "-"),
        description: `${item.category} car category.`,
      },
    });

    const brand = await db.vehicleBrand.upsert({
      where: { slug: item.brand.toLowerCase().replace(/\s+/g, "-") },
      update: {},
      create: {
        name: item.brand,
        slug: item.brand.toLowerCase().replace(/\s+/g, "-"),
      },
    });

    const model = await db.vehicleModel.create({
      data: {
        brandId: brand.id,
        name: item.model,
        year: 2024,
      },
    });

    const variant = await db.vehicleVariant.create({
      data: {
        modelId: model.id,
        name: `${item.model} ${item.transmission} ${item.fuel}`,
        transmission: item.transmission as any,
        fuelType: item.fuel as any,
        engineCapacity: 1200,
      },
    });

    const vehicle = await db.vehicle.create({
      data: {
        plateNumber: `MH-12-${Math.floor(1000 + Math.random() * 9000)}-${item.slug.slice(0, 3)}`,
        vin: `VIN-${Date.now()}-${Math.floor(100 + Math.random() * 900)}-${item.slug.slice(0, 3)}`,
        brandId: brand.id,
        modelId: model.id,
        variantId: variant.id,
        categoryId: category.id,
        locationId: defaultCity.id,
        color: "Premium White",
        transmission: item.transmission as any,
        fuelType: item.fuel as any,
        mileage: 15000,
        status: "AVAILABLE",
      },
    });

    await db.vehiclePricing.create({
      data: {
        vehicleId: vehicle.id,
        hourlyRate: 150,
        dailyRate: item.price,
        weeklyRate: item.price * 6,
        monthlyRate: item.price * 22,
        basePrice: item.price,
        securityDeposit: 5000,
      },
    });
  }

  console.log("✅ Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
