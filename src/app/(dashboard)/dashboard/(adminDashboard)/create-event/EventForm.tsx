/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import {toast} from "sonner"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import type * as z from "zod"
import {Button} from "@/components/ui/button"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {DatetimePicker} from "@/components/ui/datetime-picker"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {newEventSchema} from "@/schema/event-schema"
import FileUpload from "@/components/file-upload"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {CalendarDays, DollarSign, MapPin, Ticket, Upload} from "lucide-react"
import {Separator} from "@/components/ui/separator"
import {useRouter} from "next/navigation";
import {createEvent} from "@/actions/eventActions";

export const eventCategories = [
    {
        label: "Music Festivals",
        value: "music",
    },
    {
        label: "Food & Drink",
        value: "food",
    },
    {
        label: "Art Exhibitions",
        value: "art",
    },
    {
        label: "Workshops & Classes",
        value: "workshops",
    },
    {
        label: "Sports Events",
        value: "sports",
    },
    {
        label: "Networking",
        value: "networking",
    },
    {
        label: "Cultural Festivals",
        value: "cultural",
    },
    {
        label: "Movies",
        value: "movies",
    }
]
export const filterCategories = [
    {
        label: "All",
        value: "all",
    },
    ...eventCategories,
]


export default function EventForm() {
    const router = useRouter()
    const form = useForm<z.infer<typeof newEventSchema>>({
        resolver: zodResolver(newEventSchema),
        defaultValues: {
            category: "",
            startDate: new Date(),
            endDate: new Date(),
            title: "",
            description: "",
            location: "",
            coverImage: "",
        },
    })

    async function onSubmit(values: z.infer<typeof newEventSchema>) {
        try {
            const formattedValues = {
                ...values,
                totalTickets: Number(values.totalTickets),
                ticketPrice: Number(values.ticketPrice),
                availableTickets: Number(values.totalTickets),
            }
            const response = await createEvent(formattedValues)
            console.log(response)
            if (response.success) {
                toast.success(response.message)
                router.push("/dashboard/event-management")
            }
        } catch (error: any) {
            console.error("Form submission error", error)
            toast.error("Failed to submit the form. Please try again.")
            toast.error(error.message)
        }
    }

    return (
        <div className="container py-10">
            <Card className="max-w-4xl mx-auto">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Create New Event</CardTitle>
                    <CardDescription>Fill in the details below to create your event</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <CalendarDays className="h-5 w-5 text-muted-foreground"/>
                                    <h3 className="text-lg font-medium">Event Details</h3>
                                </div>
                                <Separator/>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Event Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter event title" {...field} />
                                            </FormControl>
                                            <FormDescription>Give your event a clear, descriptive
                                                title</FormDescription>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <SelectTrigger className={"w-full"}>
                                                        <SelectValue placeholder="Select category"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {eventCategories.map((category) => (
                                                            <SelectItem key={category.value} value={category.value}>
                                                                {category.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormDescription>Choose the category that best fits your
                                                event</FormDescription>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="description"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe your event in detail..."
                                                className="min-h-32 resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Include important details like what attendees can expect, special guests,
                                            etc.
                                        </FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-muted-foreground"/>
                                    <h3 className="text-lg font-medium">Location & Time</h3>
                                </div>
                                <Separator/>
                            </div>

                            <FormField
                                control={form.control}
                                name="location"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Location</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter event location" {...field} />
                                        </FormControl>
                                        <FormDescription>Provide the full address or venue name</FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <div className="grid gap-6 sm:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="startDate"
                                    render={({field}) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Start Date & Time</FormLabel>
                                            <DatetimePicker
                                                {...field}
                                                format={[
                                                    ["months", "days", "years"],
                                                    ["hours", "minutes", "am/pm"],
                                                ]}
                                            />
                                            <FormDescription>When does your event start?</FormDescription>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="endDate"
                                    render={({field}) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>End Date & Time</FormLabel>
                                            <DatetimePicker
                                                {...field}
                                                format={[
                                                    ["months", "days", "years"],
                                                    ["hours", "minutes", "am/pm"],
                                                ]}
                                            />
                                            <FormDescription>When does your event end?</FormDescription>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Ticket className="h-5 w-5 text-muted-foreground"/>
                                    <h3 className="text-lg font-medium">Tickets</h3>
                                </div>
                                <Separator/>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="totalTickets"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Total Tickets</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter number of tickets" type="number"
                                                       min="1" {...field} />
                                            </FormControl>
                                            <FormDescription>How many tickets are available for sale?</FormDescription>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="ticketPrice"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Ticket Price</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <DollarSign
                                                        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                                                    <Input placeholder="0.00" type="number" min="0" step="0.01"
                                                           className="pl-10" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormDescription>Set the price per ticket (0 for free
                                                events)</FormDescription>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Upload className="h-5 w-5 text-muted-foreground"/>
                                    <h3 className="text-lg font-medium">Event Image</h3>
                                </div>
                                <Separator/>
                            </div>

                            <FormField
                                control={form.control}
                                name="coverImage"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Cover Image</FormLabel>
                                        <FormControl>
                                            <FileUpload
                                                type="image"
                                                accept="image/*"
                                                placeholder="Upload event cover image"
                                                folder="event-cover"
                                                variant="light"
                                                onFileChange={field.onChange}
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Upload an eye-catching image for your event (recommended size: 1200×630px)
                                        </FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <CardFooter className="flex justify-end gap-2 px-0">
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                                <Button type="submit">Create Event</Button>
                            </CardFooter>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

