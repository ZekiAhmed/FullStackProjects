// import { verifyWebhook } from '@clerk/nextjs/webhooks'
// import { NextRequest } from 'next/server'
// import prisma from '@/prisma'

// export async function POST(req: NextRequest) {
//     const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET

//     if (!SIGNING_SECRET) {
//         throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to env.')
//     }


//     try {
//           // Get body
//         const payload = await req.json();
//         const body = JSON.stringify(payload);

//         const evt = await verifyWebhook(req)

//         // Do something with payload
//         // For this guide, log payload to console
//         const { id } = evt.data
//         const eventType = evt.type
//         console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
//         console.log('Webhook payload:', evt.data)

//         //   console.log(evt.data)

//         if (eventType === "user.created") {
//             try {
//                 await prisma.user.create({
//                     data: {
//                         id: evt.data.id,
//                         username: JSON.parse(body).data.username,
//                         email: JSON.parse(body).data.email_addresses[0].email_address,
//                         img: JSON.parse(body).image_url || ""
//                     },
//                 });
//                 return new Response("User created", { status: 200 });
//             } catch (err) {
//                 console.log(err);
//                 return new Response("Error: Failed to create a user!", {
//                     status: 500,
//                 });
//             }
//         }

//         if (eventType === "user.deleted") {
//             try {
//                 await prisma.user.delete({ where: { id: evt.data.id } });
//                 return new Response("User deleted", { status: 200 });
//             } catch (err) {
//                 console.log(err);
//                 return new Response("Error: Failed to create a user!", {
//                     status: 500,
//                 });
//             }
//         }


//         return new Response('Webhook received', { status: 200 })
//     } catch (err) {
//         console.error('Error verifying webhook:', err)
//         return new Response('Error verifying webhook', { status: 400 })
//     }
// }


//===================================================================



import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import  prisma  from "@/prisma";

export async function POST(req: Request) {
  const CLERK_WEBHOOK_SIGNING_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  if (!CLERK_WEBHOOK_SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(CLERK_WEBHOOK_SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  // Do something with payload
  // For this guide, log payload to console
  const { id } = evt.data;
  const eventType = evt.type;
  console.log(`Received webhook with ID ${id} and event type of ${eventType}`);
  console.log("Webhook payload:", body);

//   console.log(evt.data)

  if (eventType === "user.created") {
    try {
      await prisma.user.create({
        data: {
          id: evt.data.id,
          username: JSON.parse(body).data.username,
          email: JSON.parse(body).data.email_addresses[0].email_address,
          img: JSON.parse(body).image_url || ""
        },
      });
      return new Response("User created", { status: 200 });
    } catch (err) {
      console.log(err);
      return new Response("Error: Failed to create a user!", {
        status: 500,
      });
    }
  }

  if (eventType === "user.deleted") {
    try {
      await prisma.user.delete({ where: { id: evt.data.id } });
      return new Response("User deleted", { status: 200 });
    } catch (err) {
      console.log(err);
      return new Response("Error: Failed to create a user!", {
        status: 500,
      });
    }
  }

  return new Response("Webhook received", { status: 200 });
}
