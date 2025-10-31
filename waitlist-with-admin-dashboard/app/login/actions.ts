"use server";

import { z } from "zod";
import { createSession, deleteSession } from "../lib/session";
import { redirect } from "next/navigation";
import { prisma } from "../utils/prisma";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).trim(),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }).trim(),
});

export async function login(prevState: any, formData: FormData) {
  const result = loginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { email, password } = result.data;

  try {
    // Try to access DB
    const admin = await prisma.admin.findFirst();

    if (!admin) {
      return {
        warning: "No admin found. Please contact support."
        };
    }

    const { email: adminEmail, password: adminPassword, id } = admin;

    if (email !== adminEmail || password !== adminPassword) {
      return {
        errors: {
          email: ["Invalid email or password"],
        },
      };
    } 

      // Successful login
  
      await createSession(id);
      // redirect("/dashboard");
      return { success: true };

    

  } catch (error: any) {
    console.error("Login error:", error);

    // ✅ Handle Prisma connection errors gracefully
    if (error.message?.includes("Please make sure your database server is running")) {
      return {
        warning:"Database connection failed. Please try again later."
        // errors: {
        //   email: ["Database connection failed. Please try again later."],
        // },
      };
    }

    // ✅ Generic fallback (never expose details)
    return {
        email: "Something went wrong. Please try again later."
      };
  }
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
