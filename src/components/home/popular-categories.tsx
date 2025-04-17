"use client"
import Image from "next/image"
import {BentoGrid, BentoGridItem} from "@/components/bento-grid"
import {motion} from "motion/react"
import Link from "next/link";

export default function PopularCategories() {
    return (
        <div className="py-12 px-4 md:px-6 lg:px-8" id="popular-events">
            <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-700 dark:text-neutral-200 mb-3">
                    Popular Event Categories
                </h2>
                <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">
                    Discover and book the best events in your city across various categories
                </p>
            </div>

            <BentoGrid className="max-w-7xl mx-auto">
                {eventCategories.map((category, i) => (
                    <Link
                        key={i}
                        href={`/events?category=${category.slug}`}
                        className={
                            i === 0
                                ? "sm:col-span-2 md:col-span-1 lg:col-span-1"
                                : // First item spans 2
                                i === 1
                                    ? "sm:col-span-2 md:col-span-1 lg:col-span-1"
                                    : // Second item spans 2
                                    i === 2
                                        ? "sm:col-span-2 md:col-span-1  lg:col-span-2"
                                        : // Third item spans 3
                                        i === 3
                                            ? "sm:col-span-2 md:col-span-1  lg:col-span-2"
                                            : // Fourth item spans 1
                                            i === 4
                                                ? "sm:col-span-1 md:col-span-1  lg:col-span-1"
                                                : // Fifth item spans 1
                                                i === 5
                                                    ? "sm:col-span-1  lg:col-span-1"
                                                    : // Sixth item spans 2
                                                    i === 6 ?
                                                        "sm:col-span-2 lg:col-span-2"
                                                        : "sm:col-span-2 lg:col-span-2"

                        }

                    >
                        <motion.div whileHover={{scale: 1.02}} transition={{duration: 0.2}} className="h-full">
                            <BentoGridItem
                                title={category.title}
                                description={category.description}
                                header={
                                    <div className="w-full h-full min-h-[8rem] rounded-lg overflow-hidden relative">
                                        <Image
                                            src={category.image || "/placeholder.svg"}
                                            alt={category.title}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover/bento:scale-105"
                                        />
                                        <div
                                            className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
                                        <div
                                            className="absolute bottom-3 left-3 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 text-xs font-medium py-1 px-2 rounded-full border border-pink-300">
                                            {category.eventCount}+ events
                                        </div>
                                    </div>
                                }
                                className="h-full cursor-pointer"
                            />
                        </motion.div>
                    </Link>
                ))}
            </BentoGrid>
        </div>
    )
}

const eventCategories = [
    {
        title: "Music Festivals",
        description: "From electronic dance to indie rock, experience the best music festivals.",
        image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&h=300&fit=crop",
        eventCount: 120,
        slug: "music",
    },
    {
        title: "Food & Drink",
        description: "Culinary experiences, wine tastings, and food festivals for every palate.",
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=400&auto=format&fit=crop",
        eventCount: 85,
        slug: "food",
    },
    {
        title: "Art Exhibitions",
        description: "Discover contemporary and classical art from renowned and emerging artists.",
        image: "https://images.unsplash.com/photo-1530263131525-1c1d26feaa60?q=80&w=2071&auto=format&fit=crop",
        eventCount: 64,
        slug: "art",
    },
    {
        title: "Workshops & Classes",
        description: "Learn new skills, from cooking to crafting, with expert-led workshops.",
        image: "https://images.unsplash.com/photo-1558008258-3256797b43f3?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        eventCount: 150,
        slug: "workshops",
    },
    {
        title: "Sports Events",
        description: "Catch live sports action from local matches to major tournaments.",
        image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=400&h=300&fit=crop",
        eventCount: 92,
        slug: "sports",
    },
    {
        title: "Networking",
        description: "Connect with professionals and expand your network at business events.",
        image: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?q=80&w=400&h=300&fit=crop",
        eventCount: 78,
        slug: "networking",
    },
    {
        title: "Cultural Festivals",
        description: "Celebrate diversity with cultural festivals showcasing traditions from around the world.",
        image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=400&h=300&fit=crop",
        eventCount: 110,
        slug: "cultural",
    },
    {
        title: "Movies",
        description: "Watch exciting movies with friends and family.",
        image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=2070&auto=format&fit=crop",
        eventCount: 50,
        slug: "movies",
    }
]