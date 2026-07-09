import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const sms = await prisma.smsLog.findFirst({
    orderBy: { createdAt: "desc" },
  });
  if (sms) {
    console.log("Latest SMS log message:", sms.message);
  } else {
    console.log("No SMS logs found.");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
