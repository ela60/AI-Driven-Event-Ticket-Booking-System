export const dynamic = "force-dynamic"

import prisma from "@/lib/prisma";
import BookingList from "@/app/(dashboard)/dashboard/(adminDashboard)/ticket-management/booking-table";

export default async function BookingListPage( ){
    const bookings = await prisma.booking.findMany({
        include : {
            payment : true,
            user: true
        }
    });
    return (
        <>
            <div className="container py-10">
                <h1 className="text-3xl font-bold mb-6">Booking List</h1>
                <BookingList bookings={bookings} />
            </div>
        </>
    )
}