import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { internal } from "./_generated/api";

const validatePayLoad = async (req: Request): Promise<WebhookEvent | undefined> => {
	const payload = await req.text();
	const svixHeaders = {
		"svix-id": req.headers.get("svix-id")!,
		"svix-timestamp": req.headers.get("svix-timestamp")!,
		"svix-signature": req.headers.get("svix-signature")!,
	};

	const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

	try {
		const event = webhook.verify(payload, svixHeaders) as WebhookEvent;
		return event;
	} catch (err) {
		console.error("Webhook verification failed:", err);
		return undefined;
	}
};

const handleClerkUsersWebhook = httpAction(async ({ ctx, req }: any) => {
	const event = await validatePayLoad(req);

	if (!event) {
		return new Response("Invalid payload", { status: 400 });
	}

	switch (event.type) {
		case "user.created": {
			const existingUser = await ctx.runQuery(internal.user.get, {
				clerkId: event.data.id,
			});

			if (existingUser) {
				return new Response("User already exists", { status: 400 });
			}

			await ctx.runMutation(internal.user.create, {
				userName: `${event.data.first_name} ${event.data.last_name}`.trim(),
				imageUrl: event.data.image_url,
				clerkId: event.data.id,
				email: event.data.email_addresses[0].email_address,
			});

			return new Response("User created", { status: 201 });
		}

		case "user.updated": {
			await ctx.runMutation(internal.user.create, {
				clerkId: event.data.id,
				userName: `${event.data.first_name} ${event.data.last_name}`.trim(),
				imageUrl: event.data.image_url,
				email: event.data.email_addresses[0].email_address,
			});

			return new Response("User updated", { status: 200 });
		}

		default:
			console.warn(`Unhandled event type: ${event.type}`);
			return new Response(`Unhandled event type: ${event.type}`, { status: 400 });
	}
});

const http = httpRouter();

http.route({
	path: "/clerk-users-webhook",
	method: "POST",
	handler: handleClerkUsersWebhook,
});

export default http;