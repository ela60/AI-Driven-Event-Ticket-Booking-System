"use server"

import prisma from "@/lib/prisma";
import {IEvent} from "@/app/(dashboard)/dashboard/(adminDashboard)/event-management/event-table";
import {revalidatePath} from "next/cache";
import {auth} from "@/auth";
import { Prisma } from "@prisma/client";



interface EventFormData {
    title: string;
    description: string;
    category: string;
    location: string;
    startDate: Date;
    endDate: Date;
    totalTickets: number;
    ticketPrice: number;
    coverImage: string;
}


export async function createEvent(formData: EventFormData) {
    const session = await auth()

    const data = {
        ...formData,
        organizerId: session?.user?.id as string
    }

    try {
        await prisma.event.create({
            data: data
        })
        return {success: true, message: "Event created successfully"}
    } catch (error) {
        console.log(error)
        return {success: false, message: "Failed to create event"}
    }
}


export async function GetAllEvents() {
    return await prisma.event.findMany()
}

export async function updateEvent(id: string, data: IEvent) {
    if (!id) {
        throw new Error("Event not found!")
    }

    try {
        await prisma.event.update({
            where: {id: id},
            data: data
        })
        revalidatePath("/dashboard/event-management")
        return {success: true, message: "Event updated successfully"}
    } catch (error) {
        console.log(error)
        throw new Error("Failed to update event")
    }
}

export async function deleteEvent(id: string) {
    if (!id) {
        throw new Error("Event not found!")
    }

    try {
        await prisma.event.delete({
            where: {id: id}
        })
        revalidatePath("/dashboard/event-management")
        return {success: true, message: "Event deleted successfully"}
    } catch (error) {
        console.log(error)
        throw new Error("Failed to delete event")
    }
}

export async function getSearchedEvents(
    search: string | null,
    category: string | null,
    sort: string | null,
) {

    const where: Prisma.EventWhereInput = {};
    const orderBy: Prisma.EventOrderByWithRelationInput[] = []


    if (category && category !== "all") {
        where.category = category;
    }
    if (search) {
        where.OR = [
            {title: {contains: search, mode: "insensitive"}},
            {description: {contains: search, mode: "insensitive"}}
        ]
    }
    switch (sort) {
        case "price_low":
            orderBy.push({ticketPrice: "asc"});
            break;
        case "price_high":
            orderBy.push({ticketPrice: "desc"});
            break;
        case "popular":
            orderBy.push({createdAt: "desc"});
            break;
        case "latest":
        default:
            orderBy.push({createdAt: "desc"});
            break;
    }

    return await prisma.event.findMany({
        where,
        orderBy
    })
}