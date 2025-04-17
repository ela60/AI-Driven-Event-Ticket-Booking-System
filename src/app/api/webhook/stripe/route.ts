import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { headers } from "next/headers"
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string

export async function POST(request: NextRequest) {
    try {
        const body = await request.text()
        const signature = (await headers()).get("stripe-signature") as string

        console.log("Received webhook request with signature:", signature ? "✓" : "✗")

        let event: Stripe.Event
        try {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
            console.log(`Webhook event verified: ${event.type} (${event.id})`)
        } catch (err) {
            console.error(`Webhook signature verification failed: ${err instanceof Error ? err.message : "Unknown error"}`)
            console.error("Webhook secret used:", webhookSecret ? `${webhookSecret.substring(0, 4)}...` : "missing")
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
        }

        console.log(`Processing webhook event: ${event.type}`)

        if (event.type === "checkout.session.completed") {
            console.log("Processing checkout.session.completed event")
            await handleSuccessfulPayment(event.data.object as Stripe.Checkout.Session)
        } else if (event.type === "payment_intent.payment_failed") {
            console.log("Processing payment_intent.payment_failed event")
            await handleFailedPayment(event.data.object as Stripe.PaymentIntent)
        } else if (event.type === "checkout.session.expired") {
            console.log("Processing checkout.session.expired event")
            await handleExpiredSession(event.data.object as Stripe.Checkout.Session)
        }

        return NextResponse.json({ received: true }, { status: 200 })
    } catch (error) {
        console.error("Webhook error:", error)
        return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
    }
}

// Update the handleSuccessfulPayment function to add more detailed logging and error handling
async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
    console.log("Processing successful payment for session:", session.id)

    const eventId = session.metadata?.eventId
    const userId = session.metadata?.userId
    const userEmail = session.metadata?.userEmail || session.customer_details?.email || ""
    const userName = session.metadata?.userName || session.customer_details?.name || ""
    const eventTitle = session.metadata?.eventTitle || ""
    const ticketPrice = session.metadata?.ticketPrice ? Number.parseFloat(session.metadata.ticketPrice) : 0

    console.log("Payment metadata:", {
        eventId,
        userId,
        userEmail,
        eventTitle,
        ticketPrice,
    })

    if (!eventId) {
        console.error("No event ID found in session metadata")
        return
    }

    // Retrieve the payment intent for additional details
    let paymentIntent: Stripe.PaymentIntent | null = null
    if (session.payment_intent) {
        try {
            paymentIntent = await stripe.paymentIntents.retrieve(
                typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent.id,
            )
            console.log("Retrieved payment intent:", paymentIntent.id)
        } catch (err) {
            console.error("Error retrieving payment intent:", err)
        }
    }

    try {
        // Use a transaction to ensure both payment and booking are created together
        console.log("Starting database transaction")

        // First check if a payment record already exists for this session
        const existingPayment = await prisma.payment.findUnique({
            where: { stripeSessionId: session.id },
        })

        if (existingPayment) {
            console.log("Payment record already exists for session:", session.id)
            return
        }

        await prisma.$transaction(async (tx) => {
            console.log("Creating booking for user:", userId, "event:", eventId)

            // 1. Create the booking
            const booking = await tx.booking.create({
                data: {
                    userId: userId || "", // If userId is empty, this will fail - handle appropriately
                    eventId,
                },
            })
            console.log("Booking created with ID:", booking.id)

            // 2. Create the payment record
            console.log("Creating payment record for session:", session.id)
            const payment = await tx.payment.create({
                data: {
                    stripeSessionId: session.id,
                    stripePaymentIntentId:
                        typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
                    amount: session.amount_total ? session.amount_total / 100 : ticketPrice,
                    currency: session.currency || "usd",
                    status: "COMPLETED",
                    paymentMethod: paymentIntent?.payment_method_types?.[0] || "card",

                    // User information
                    userId: userId || null,
                    customerEmail: userEmail,
                    customerName: userName,

                    // Event information
                    eventId,
                    eventTitle,
                    ticketPrice,

                    // Link to booking
                    bookingId: booking.id,

                    // Payment date
                    paymentDate: new Date(),
                },
            })
            console.log("Payment record created with ID:", payment.id)

            // 3. Update available tickets
            console.log("Updating available tickets for event:", eventId)
            await tx.event.update({
                where: { id: eventId },
                data: {
                    availableTickets: {
                        decrement: 1,
                    },
                },
            })
            console.log("Event tickets updated successfully")
        })
        console.log("Transaction completed successfully for session:", session.id)
    } catch (error) {
        console.error("Error in transaction:", error)
        // Re-throw to be caught by the main handler
        throw error
    }
}

async function handleFailedPayment(paymentIntent: Stripe.PaymentIntent) {
    console.log("Handling failed payment for payment intent:", paymentIntent.id)

    const metadata = paymentIntent.metadata
    const eventId = metadata.eventId
    const userId = metadata.userId
    const userEmail = metadata.userEmail || ""
    const userName = metadata.userName || ""
    const eventTitle = metadata.eventTitle || ""
    const ticketPrice = metadata.ticketPrice ? Number.parseFloat(metadata.ticketPrice) : 0

    console.log("Payment intent metadata:", {
        eventId,
        userId,
        userEmail,
        eventTitle,
        ticketPrice,
    })

    if (!eventId) {
        console.error("No event ID found in payment intent metadata")
        return
    }

    try {
        console.log("Creating failed payment record")
        await prisma.payment.create({
            data: {
                stripeSessionId: paymentIntent.id,
                stripePaymentIntentId: paymentIntent.id,
                amount: paymentIntent.amount / 100,
                currency: paymentIntent.currency,
                status: "FAILED",
                paymentMethod: paymentIntent.payment_method_types?.[0] || "card",

                // User information
                userId: userId || null,
                customerEmail: userEmail,
                customerName: userName,

                // Event information
                eventId,
                eventTitle,
                ticketPrice,

                // Error information
                errorMessage: paymentIntent.last_payment_error?.message || "Payment failed",
            },
        })
        console.log("Failed payment record created successfully")
    } catch (error) {
        console.error("Error creating failed payment record:", error)
        throw error
    }
}

async function handleExpiredSession(session: Stripe.Checkout.Session) {
    console.log("Handling expired session:", session.id)

    // Extract metadata
    const eventId = session.metadata?.eventId
    const userId = session.metadata?.userId
    const userEmail = session.metadata?.userEmail || session.customer_details?.email || ""
    const userName = session.metadata?.userName || session.customer_details?.name || ""
    const eventTitle = session.metadata?.eventTitle || ""
    const ticketPrice = session.metadata?.ticketPrice ? Number.parseFloat(session.metadata.ticketPrice) : 0

    console.log("Expired session metadata:", {
        eventId,
        userId,
        userEmail,
        eventTitle,
        ticketPrice,
    })

    if (!eventId) {
        console.error("No event ID found in session metadata")
        return
    }

    try {
        console.log("Creating expired session payment record")
        // Create a payment record for the expired session
        await prisma.payment.create({
            data: {
                stripeSessionId: session.id,
                stripePaymentIntentId:
                    typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
                amount: session.amount_total ? session.amount_total / 100 : ticketPrice,
                currency: session.currency || "usd",
                status: "FAILED",

                // User information
                userId: userId || null,
                customerEmail: userEmail,
                customerName: userName,

                // Event information
                eventId,
                eventTitle,
                ticketPrice,

                // Error information
                errorMessage: "Checkout session expired",
            },
        })
        console.log("Expired session payment record created successfully")
    } catch (error) {
        console.error("Error creating expired session payment record:", error)
        throw error
    }
}

