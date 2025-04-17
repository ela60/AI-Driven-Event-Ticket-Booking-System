import React from 'react';
import MyTicketTable from './my-ticket-table';
import prisma from "@/lib/prisma";
import {auth} from "@/auth";

export default async function MyTicket() {
    const session = await auth();
    const user = session?.user;


    const tickets = await prisma.booking.findMany({
        where: {userId: user.id!},
        include: {
            payment: true,
            user: true,
            event: true
        }
    });


    return (
        <div className={"mx-auto max-w-7xl"}>
            <MyTicketTable bookings={tickets}/>
        </div>
    );
};

