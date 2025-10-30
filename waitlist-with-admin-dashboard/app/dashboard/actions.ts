"use server";

import { prisma } from "../utils/prisma";

export async function getEmails() {
  try {
    const emails = await prisma.waitlistEntry.findMany({
      select: { email: true },
      orderBy: { createdAt: "desc" },
    });
    // console.log("Fetched emails:", emails);
    return emails.map((e) => e.email);
  } catch (error) {
    console.error("Error fetching emails:", error);
    return [];
  }
}
