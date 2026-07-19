import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
    try {
        const body = await req.text();

        const signature = req.headers.get("stripe-signature");

        if (!signature) {
            return NextResponse.json(
                { error: "Missing Stripe signature" },
                { status: 400 }
            );
        }

        const event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );

        switch (event.type) {
            /**
             * ========================================
             * CHECKOUT COMPLETED
             * ========================================
             */
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;


                const customerId = session.customer as string;
                const subscriptionId = session.subscription as string;

                // Check user exists
                const email =
                    session.customer_details?.email ??
                    session.customer_email;

                const user = await prisma.user.findUnique({
                    where: {
                        email: email!,
                    },
                });




                if (!user) {
                    throw new Error("User not found.");
                }

                // Retrieve Stripe subscription
                const subscription =
                    await stripe.subscriptions.retrieve(subscriptionId);

                const priceId = subscription.items.data[0].price.id;

                const period =
                    priceId === process.env.STRIPE_YEARLY_PRICE_ID
                        ? "yearly"
                        : "monthly";

                const startDate = new Date();

                const endDate = new Date(startDate);

                if (period === "monthly") {
                    endDate.setMonth(endDate.getMonth() + 1);
                } else {
                    endDate.setFullYear(endDate.getFullYear() + 1);
                }

                // Update User
                await prisma.user.update({
                    where: {
                        id: user.id,
                    },
                    data: {
                        customerId,
                        plan: "premium",
                    },
                });

                // Upsert Subscription
                await prisma.subscription.upsert({
                    where: {
                        userId: user.id,
                    },
                    update: {
                        plan: "premium",
                        period,
                        startDate,
                        endDate,
                    },
                    create: {
                        userId: user.id,
                        plan: "premium",
                        period,
                        startDate,
                        endDate,
                    },
                });

                console.log("✅ Subscription Created");

                break;
            }

            /**
             * ========================================
             * SUBSCRIPTION UPDATED
             * ========================================
             */
            case "customer.subscription.updated": {
                const subscription = event.data.object as Stripe.Subscription;

                const customerId = subscription.customer as string;

                const user = await prisma.user.findFirst({
                    where: {
                        customerId,
                    },
                });

                if (!user) {
                    throw new Error("User not found.");
                }

                const priceId = subscription.items.data[0].price.id;

                const period =
                    priceId === process.env.STRIPE_YEARLY_PRICE_ID
                        ? "yearly"
                        : "monthly";

                const startDate = new Date();

                const endDate = new Date(startDate);

                if (period === "monthly") {
                    endDate.setMonth(endDate.getMonth() + 1);
                } else {
                    endDate.setFullYear(endDate.getFullYear() + 1);
                }

                await prisma.user.update({
                    where: {
                        id: user.id,
                    },
                    data: {
                        plan: "premium",
                    },
                });

                await prisma.subscription.update({
                    where: {
                        userId: user.id,
                    },
                    data: {
                        period,
                        plan: "premium",
                        startDate,
                        endDate,
                    },
                });

                console.log("✅ Subscription Updated");

                break;
            }

            /**
             * ========================================
             * SUBSCRIPTION DELETED
             * ========================================
             */
            case "customer.subscription.deleted": {
                const subscription = event.data.object as Stripe.Subscription;

                const customerId = subscription.customer as string;

                console.log("Stripe Customer ID:", customerId);

                const user = await prisma.user.findUnique({
                    where: {
                        customerId,
                    },
                });

                if (!user) {
                    throw new Error("User not found.");
                }

                await prisma.subscription.deleteMany({
                    where: {
                        userId: user.id,
                    },
                });

                await prisma.user.update({
                    where: {
                        id: user.id,
                    },
                    data: {
                        plan: "free",
                    },
                });

                console.log("❌ Subscription Deleted");

                break;
            }

            default:
                console.log(`Unhandled event: ${event.type}`);
        }

        return NextResponse.json(
            {
                received: true,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error("Webhook Error:", error);

        return NextResponse.json(
            {
                error:
                    error instanceof Error ? error.message : "Something went wrong.",
            },
            {
                status: 400,
            }
        );
    }
}