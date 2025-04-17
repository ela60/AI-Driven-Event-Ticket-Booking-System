import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export const POST = async (request: NextRequest) => {
    try {
        const { title, price, description, email, eventId } = await request.json()

        const session = await auth()
        const user = session?.user

        const event = await prisma.event.findUnique({
            where: { id: eventId },
            select: {
                title: true,
                location: true,
                startDate: true,
            },
        })

        if (!event) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 })
        }

        const stripeSession = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: title,
                            description: description,
                        },
                        unit_amount: Number.parseFloat(price) * 100,
                    },
                    quantity: 1,
                },
            ],

            mode: "payment",
            customer_email: email,
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/events/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/`,
            metadata: {
                eventId,
                userId: user?.id,
                userEmail: user?.email,
                userName: user?.name,
                eventTitle: title,
                ticketPrice: price,
                eventLocation: event.location,
                eventDate: event.startDate.toISOString(),
            },
        })

        return NextResponse.json({ sessionId: stripeSession.id }, { status: 200 })
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }
        return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 })
    }
}

