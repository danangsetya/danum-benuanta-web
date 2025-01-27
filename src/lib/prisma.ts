// import { PrismaClient } from "@prisma/client";
import { PrismaClient } from "../../prisma/generated/client1";
// import { PrismaClient as PrismaClient2 } from "../../prisma/generated/client2";
const globalPrisma = global as unknown as { prisma: PrismaClient };
// const globalPrisma2 = global as unknown as { prisma: PrismaClient2 };

export const prisma = globalPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalPrisma.prisma = prisma;
// export const prisma2 = globalPrisma2.prisma || new PrismaClient2();
