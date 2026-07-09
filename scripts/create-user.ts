import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@tripzy.com";
  const phone = "9988776655";

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { phone }] },
  });

  if (existing) {
    await prisma.user.delete({ where: { id: existing.id } });
    console.log("Deleted existing test user.");
  }

  const user = await prisma.user.create({
    data: {
      email,
      phone,
      passwordHash: "", // Auth managed via Supabase. Create user via Supabase Auth UI.
      isKycVerified: false,
      status: "ACTIVE",
      profile: {
        create: {
          firstName: "Admin",
          lastName: "User",
        },
      },
    },
  });

  console.log("Created Prisma user:", user.email);
  console.log("IMPORTANT: Create this user in Supabase Auth dashboard too.");
  console.log("Go to: Authentication > Users > Invite user");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
