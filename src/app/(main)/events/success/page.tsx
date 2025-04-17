"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Calendar, MapPin, CreditCard, User, Mail } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import axios from "axios"


interface PaymentDetails {
    id: string
    eventTitle: string
    amount: number
    currency: string
    customerName: string
    customerEmail: string
    paymentDate: string
    eventDate: string
    eventLocation: string
}

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const sessionId = searchParams.get("session_id")

    // Replace the entire useEffect hook with this simplified version that only uses the session route
    useEffect(() => {
        // If no session_id is provided, redirect to events page
        if (!sessionId) {
            router.push("/events")
            return
        }

        async function fetchSessionDetails() {
            try {
                setLoading(true)
                console.log("Fetching session details for session:", sessionId)
                const response = await axios.get(`/api/payment/session?sessionId=${sessionId}`)

                if (response.data) {
                    console.log("Successfully retrieved Stripe session data:", response.data)
                    const data = response.data
                    setPaymentDetails({
                        id: data.id || sessionId,
                        eventTitle: data.eventTitle || "Your Event",
                        amount: data.amount || 0,
                        currency: data.currency || "usd",
                        customerName: data.customerName || "Customer",
                        customerEmail: data.customerEmail || "",
                        paymentDate: data.created ? new Date(data.created * 1000).toISOString() : new Date().toISOString(),
                        eventDate: data.eventDate || new Date().toISOString(),
                        eventLocation: data.eventLocation || "Venue",
                    })
                }
                setLoading(false)
            } catch (err) {
                console.error("Error fetching session details:", err)
                setError("We couldn't load your payment details, but your payment was successful.")
                setLoading(false)
            }
        }

        fetchSessionDetails()
    }, [sessionId, router])

    // Format currency
    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency,
        }).format(amount)
    }

    return (
        <div className="container max-w-3xl mx-auto py-12 px-4">
            <Card className="w-full">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <CheckCircle2 className="h-16 w-16 text-green-500" />
                    </div>
                    <CardTitle className="text-2xl md:text-3xl">Payment Successful!</CardTitle>
                    <CardDescription className="text-base md:text-lg">
                        Thank you for your purchase. Your ticket has been confirmed.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {loading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-6 w-1/2" />
                            <Skeleton className="h-6 w-2/3" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-4">
                            <p className="text-amber-600">{error}</p>
                            <p className="mt-2">Your payment was successful and a confirmation has been sent to your email.</p>
                            <p className="mt-1 text-sm text-gray-500">Session ID: {sessionId}</p>
                            <div className="mt-4 p-4 bg-green-50 rounded-lg">
                                <p className="text-green-700 font-medium">Your ticket is confirmed!</p>
                                <p className="text-green-600 text-sm mt-1">You can view all your tickets in your account dashboard.</p>
                            </div>
                        </div>
                    ) : paymentDetails ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-start gap-2">
                                    <div className="mt-1 text-gray-500">
                                        <CreditCard size={18} />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-500">Event</h3>
                                        <p className="font-semibold text-lg">{paymentDetails.eventTitle}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="mt-1 text-gray-500">
                                        <CreditCard size={18} />
                                    </div>
                                    <div>

                                        <h3 className="font-medium text-gray-500">Amount Paid</h3>
                                        <p className="font-semibold text-lg">
                                            {formatCurrency(paymentDetails.amount, paymentDetails.currency)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="mt-1 text-gray-500">
                                        <Calendar size={18} />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-500">Event Date</h3>
                                        <p>
                                            {new Date(paymentDetails.eventDate).toLocaleDateString("en-US", {
                                                weekday: "long",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="mt-1 text-gray-500">
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-500">Location</h3>
                                        <p>{paymentDetails.eventLocation}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-b py-4">
                                <h3 className="font-medium mb-2">Ticket Information</h3>
                                <div className="flex items-start gap-2 mb-2">
                                    <div className="mt-1 text-gray-500">
                                        <User size={18} />
                                    </div>
                                    <div>
                                        <p className="text-gray-600">
                                            Name: <span className="font-medium">{paymentDetails.customerName}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="mt-1 text-gray-500">
                                        <Mail size={18} />
                                    </div>
                                    <div>
                                        <p className="text-gray-600">
                                            Email: <span className="font-medium">{paymentDetails.customerEmail}</span>
                                        </p>
                                    </div>
                                </div>
                                <p className="mt-3 text-sm text-gray-500">
                                    Your ticket will be available in your email and in your account dashboard.
                                </p>
                            </div>

                            <div className="bg-green-50 p-4 rounded-lg">
                                <h3 className="font-medium text-green-800">Payment Information</h3>
                                <p className="text-green-700">Payment ID: {paymentDetails.id.substring(0, 12)}...</p>
                                <p className="text-green-700">Payment Date: {new Date(paymentDetails.paymentDate).toLocaleString()}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <p>No payment details found. Please check your email for confirmation.</p>
                            <p className="mt-1 text-sm text-gray-500">Session ID: {sessionId}</p>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" className="bg-[#902B27] hover:bg-[#7a2522] w-full sm:w-auto">
                        <Link href="/events">Browse More Events</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                        <Link href={"/dashboard/my-ticket"}>View My Tickets</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

