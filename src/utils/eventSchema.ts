import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().nonempty("Category is required"),
  location: z.string().nonempty("Location is required"),
  date: z.string().nonempty("Date is required"),
  time: z.string().nonempty("Time is required"),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
  tickets: z.string().regex(/^\d+$/, "Must be a valid number"),
  features: z.string().optional(),
  image: z.any().refine((file) => file instanceof File, "Image is required"),
});