"use client"
import Image from "next/image"
import {Button} from "../ui/button"
import {FaHeart} from "react-icons/fa"
import {MapPin} from "lucide-react"
import {SlCalender} from "react-icons/sl"
import Link from "next/link"

export interface IEvent {
    id: string
    title: string
    description: string
    category: string
    location: string
    startDate: Date
    endDate: Date
    coverImage: string
    totalTickets: number
    ticketPrice: number
    organizerId: string
    availableTickets: number | null
    createdAt: Date
    updatedAt: Date
}

interface EventCardsProps {
    events: IEvent[]
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

export default function EventCards({events = []}: EventCardsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-6">
            {events.length > 0 ? (
                events.map((event) => (
                    <div
                        key={event.id}
                        className="border rounded-xl p-3 md:p-4 shadow-lg transition-transform hover:scale-105 duration-300 flex flex-col"
                    >
                        <div className="relative">
                            <Image
                                src={process.env.NEXT_PUBLIC_URL_ENDPOINT + event.coverImage || "/placeholder.svg"}
                                alt={event.title}
                                width={400}
                                height={250}
                                className="rounded-lg w-full h-40 sm:h-48 object-cover"
                            />
                            <button
                                className="absolute top-2 right-2 bg-white p-1.5 md:p-2 rounded-full shadow-md hover:scale-110 transition duration-200">
                                <FaHeart className="text-red-500 text-sm md:text-base"/>
                            </button>
                        </div>
                        <div className="mt-3 flex-1 flex flex-col">
                            <h3 className="font-semibold text-base md:text-lg text-center line-clamp-1"
                                title={event.title}>
                                {event.title}
                            </h3>
                            <p className="text-gray-500 text-xs md:text-sm capitalize text-center mb-2">{event.category}</p>
                            <div className="mt-1 space-y-1.5 flex-1">
                                <div className="text-gray-500 text-xs md:text-sm flex items-start gap-1.5">
                                    <MapPin size={14} className="flex-shrink-0 mt-0.5"/>
                                    <span className="line-clamp-1" title={event.location}>
                    {event.location}
                  </span>
                                </div>
                                <div className="text-gray-500 text-xs md:text-sm">
                                    <div className="flex items-start gap-1.5 mb-1">
                                        <SlCalender className="flex-shrink-0 mt-0.5" size={14}/>
                                        <span className="line-clamp-1" title={formatDate(event.startDate)}>
                      {formatDate(event.startDate)}
                    </span>
                                    </div>
                                    <div className="flex items-start gap-1.5 pl-5">
                    <span className="line-clamp-1" title={formatDate(event.endDate)}>
                      {formatDate(event.endDate)}
                    </span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-lg md:text-xl font-bold mt-2 text-center text-primary">${event.ticketPrice}</p>
                                <Button asChild
                                    className="bg-[#902B27] hover:bg-[#7a2522] mt-2 text-white py-1.5 px-2 h-auto text-xs md:text-sm rounded-lg col-span-3 cursor-pointer">
                                    <Link href={`events/${event.id}`}>View Details</Link>
                                </Button>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500 col-span-full">No events found.</p>
            )}
        </div>
    )
}

