"use client"

import Image from "next/image"
import {FcRating} from "react-icons/fc"
import {Button} from "@/components/ui/button"
import {Heart, Share2, Users, Clock, UserCheck, MapPin, ArrowLeft} from "lucide-react"
import {SlCalender} from "react-icons/sl"
import {IEvent} from "@/components/AllCategories/EventCards";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {useRouter} from "next/navigation";
import {useState} from "react"
import axios from "axios";

import {loadStripe} from "@stripe/stripe-js";
import {User} from "next-auth";

// Load Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

interface EventDetailsPageProps {
    event: IEvent,
    organizer: IOrganizer,
    currentUser : User
}

interface IOrganizer {
    id: string,
    name: string | null,
    email: string
    image: string | null
}

const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })
}

export default function EventDetails({event, organizer, currentUser}: EventDetailsPageProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const displayEvent = event
    const TAGS = [
        displayEvent.category,
        displayEvent.location.split(",")[1]?.trim() || displayEvent.location,
        "Concert",
        "Live",
        `$${displayEvent.ticketPrice}`,
    ]
    const duration =
        Math.round((displayEvent.endDate.getTime() - displayEvent.startDate.getTime()) / (1000 * 60 * 60)) + " Hours"

    // Checkout Button Handler
    const checkoutButton = async () => {

        setLoading(true);
        try {
            const {data} = await axios.post("/api/payment", {
                eventId: displayEvent.id,
                title: displayEvent.title,
                description: displayEvent.description,
                price: displayEvent.ticketPrice.toString(),
                email: currentUser.email,
            });

            const stripe = await stripePromise;
            await stripe?.redirectToCheckout({sessionId: data.sessionId});
        } catch (error) {
            console.error("Payment error:", error);
            alert("Failed to initiate payment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
            <Button variant={"outline"} className={"my-4"} onClick={() => router.back()}>
                <ArrowLeft/>
                Back to events
            </Button>
            <div className="relative mb-4 sm:mb-6">
                <Image
                    src={process.env.NEXT_PUBLIC_URL_ENDPOINT + displayEvent.coverImage || "/placeholder.svg"}
                    alt={displayEvent.title}
                    width={1600}
                    height={900}
                    className="h-[300px] sm:h-[400px] md:h-[500px] w-full object-cover rounded-2xl"
                />
                <div className="absolute top-2 sm:top-5 left-2 sm:left-5 flex flex-wrap gap-1 sm:gap-2">
                    {TAGS.map((tag) => (
                        <span
                            key={tag}
                            className="bg-[#ffdde4] text-gray-800 text-[10px] sm:text-xs font-semibold px-2 sm:px-4 py-0.5 sm:py-1 rounded-full"
                        >
              {tag}
            </span>
                    ))}
                </div>
                <div
                    className="w-full sm:w-72 md:w-80 lg:w-96 bg-[#faf7f5] rounded-b-2xl sm:rounded-b-none sm:rounded-tl-2xl p-3 sm:p-4 md:p-6 flex flex-col gap-2 sm:gap-4 absolute bottom-0 right-0">
                    <div className="flex justify-between items-center">
                        <p className="text-secondary-foreground underline text-xs sm:text-sm">
                            {displayEvent.availableTickets} tickets left
                        </p>
                        <p className="flex justify-center items-center gap-1 sm:gap-2 text-sm sm:text-base">
                            <FcRating/> 4.5
                        </p>
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-lg sm:text-xl md:text-2xl font-bold">{displayEvent.title}</p>
                        <p className="text-lg sm:text-xl md:text-2xl font-bold">${displayEvent.ticketPrice}</p>
                    </div>
                    <Button onClick={checkoutButton} disabled={loading}
                            className="bg-[#902b27] hover:bg-[#7a2522] w-full text-sm sm:text-base py-1 sm:py-2">
                        {loading ? "Loading..." : "Book Now"}</Button>
                </div>
            </div>

            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">
                        {displayEvent.title}
                    </h1>
                    <p className="text-sm sm:text-base md:text-xl text-gray-600">{displayEvent.description}</p>
                </div>
                <div className="hidden sm:flex items-center gap-4">
                    <button className="p-2 rounded-full hover:bg-gray-100">
                        <Share2 className="h-5 w-5 text-gray-500"/>
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-100">
                        <Heart className="h-5 w-5 text-gray-500"/>
                    </button>
                </div>
            </div>

            {/* Event Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="md:col-span-2">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-8 mb-6 sm:mb-8 text-sm sm:text-base">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Users className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500"/>
                            <span className="text-gray-700">Group Event</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500"/>
                            <span className="text-gray-700">{duration}</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <UserCheck className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500"/>
                            <span className="text-gray-700">Max: {displayEvent.totalTickets}</span>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-6">What to Expect?</h2>
                        <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-600">
                            <p>{displayEvent.description}</p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-6">Your Ticket
                            Includes:</h2>
                        <ul className="space-y-3 sm:space-y-4">
                            {[
                                "Access to all performance stages and venues",
                                "Complimentary welcome drink upon arrival",
                                "Official festival merchandise pack",
                                "Free parking at designated areas",
                            ].map((item, index) => (
                                <li key={index} className="flex items-start gap-2 sm:gap-3">
                                    <div
                                        className="mt-0.5 sm:mt-1 flex-shrink-0 rounded-full bg-[#ffebee] p-0.5 sm:p-1">
                                        <svg
                                            className="h-3 w-3 sm:h-4 sm:w-4 text-[#902b27]"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M5 13l4 4L19 7"/>
                                        </svg>
                                    </div>
                                    <span className="text-sm sm:text-base text-gray-600">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="md:col-span-1">
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-bold mb-4">Event Details</h2>

                        <div className="space-y-4">
                            <div>
                                <div className={"flex gap-2"}>
                                    <h3 className="font-semibold text-gray-700 mb-1">Date & Time</h3>
                                    <SlCalender className="mt-1 flex-shrink-0 text-[#902b27]"/>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div>
                                        <p className="text-gray-800">{formatDate(displayEvent.startDate)}</p>
                                        <p className="text-gray-800">to {formatDate(displayEvent.endDate)}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className={"flex gap-2 "}>
                                    <h3 className="font-semibold text-gray-700 mb-1">Location</h3>
                                    <MapPin className="mt-1 flex-shrink-0 text-[#902b27]"/>
                                </div>
                                <div className="flex items-start gap-2">
                                    <p className="text-gray-800">{displayEvent.location}</p>
                                </div>
                            </div>

                            <div>
                                <div className={"flex gap-2"}>
                                    <h3 className="font-semibold text-gray-700 mb-1">Tickets</h3>
                                    <Users className="mt-1 flex-shrink-0 text-[#902b27]"/>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div>
                                        <p className="text-gray-800">${displayEvent.ticketPrice} per person</p>
                                        <p className="text-gray-600">{displayEvent.availableTickets} tickets
                                            available</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                        <h2 className="text-xl font-bold mb-4">Organizer</h2>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                <Avatar className={""}>
                                    <AvatarImage src={organizer?.image || ""} alt={"organizer image"}/>
                                </Avatar>
                            </div>
                            <div>
                                <p className="font-semibold">Event Organizer</p>
                                <p className="text-sm text-gray-500">{organizer.name}</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            Professional event organizer with years of experience in organizing memorable events.
                        </p>
                        <Button variant="outline" className="w-full border-[#902b27] text-[#902b27] hover:bg-[#ffebee]">
                            Contact Organizer
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mt-8 sm:mt-12 flex justify-center">
                <Button onClick={checkoutButton} disabled={loading}
                        className="bg-[#902b27] cursor-pointer hover:bg-[#7a2522] px-8 sm:px-12 py-2 sm:py-6 text-base sm:text-lg w-full sm:w-auto">
                    {loading ? "Loading..." : "Book Now"}
                </Button>
            </div>
        </div>
    )
}

