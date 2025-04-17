import {z} from "zod";


export const newEventSchema = z.object({
    title: z.string().min(1, {message: "Title is required"}).min(5, {message: "Title must be at least 5 characters long"}).nonempty({message: "Title is required"}),
    description: z.string().min(20, {message: "Description must be at least 20 characters long"}).max(500, {message: "Description must be at most 500 characters long"}).nonempty({message: "Description is required"}),
    category: z.string().nonempty({message: "Category is required"}),
    location: z.string().nonempty({message: "Location is required"}),
    startDate: z.coerce.date({message: "Invalid start date"}),
    endDate: z.coerce.date({message: "Invalid end date"}),
    totalTickets: z.coerce.number({message: "Total tickets is required"}).positive({message: "Total tickets must be at least 1"}),
    ticketPrice: z.coerce.number({message: "Ticket price is required"}).nonnegative({message: "Price cannot be negative"}),
    coverImage: z.string().nonempty({message: "Cover image is required"}),
});


export type NewEventType = z.infer<typeof newEventSchema>;

