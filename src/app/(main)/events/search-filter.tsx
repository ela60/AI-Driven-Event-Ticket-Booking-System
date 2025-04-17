"use client"

import { FormEvent, useEffect } from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useQueryState } from "nuqs"
import { useRouter } from "next/navigation"
import { filterCategories } from "@/app/(dashboard)/dashboard/(adminDashboard)/create-event/EventForm"
import { cn } from "@/lib/utils"

export default function SearchFilter() {
    const [searchQuery, setSearchQuery] = useQueryState("search", { defaultValue: "" })
    const [selectedCategory, setSelectedCategory] = useQueryState("category", { defaultValue: "all" })
    const [selectedSort, setSelectedSort] = useQueryState("sort", { defaultValue: "latest" })

    const router = useRouter()

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            const params = new URLSearchParams(window.location.search)
            router.replace(`/events?${params.toString()}`)
        }, 300)

        return () => clearTimeout(debounceTimer)
    }, [searchQuery, selectedCategory, selectedSort, router])

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        const params = new URLSearchParams()
        router.replace(`/events?${params.toString()}`)
    }

    return (
        <div className="w-full px-4 py-8 sm:px-6">
            <div className="mx-auto max-w-7xl">
                <div className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/5">
                    <div className="p-6 sm:p-8">
                        <div className="flex flex-col gap-6">
                            {/* Search Input - Full width on mobile */}
                            <div className="w-full">
                                <form onSubmit={handleSubmit} className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input
                                        placeholder="Search events..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className={cn(
                                            "pl-10 pr-4 h-11 w-full",
                                            "bg-gray-50 border-gray-200",
                                            "placeholder:text-gray-400",
                                            "focus:ring-2 focus:ring-primary/20 focus:border-primary",
                                            "transition-all duration-200"
                                        )}
                                    />
                                </form>
                            </div>

                            <div className="flex sm:flex-row gap-4 ">
                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                    <Select
                                        value={selectedCategory}
                                        onValueChange={setSelectedCategory}
                                    >
                                        <SelectTrigger
                                            className={cn(
                                                "w-full sm:w-[180px] h-11",
                                                "bg-gray-50 border-gray-200",
                                                "focus:ring-2 focus:ring-primary/20",
                                                "transition-all duration-200"
                                            )}
                                        >
                                            <SelectValue placeholder="Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {filterCategories.map((category) => (
                                                <SelectItem
                                                    key={category.value}
                                                    value={category.value}
                                                    className="cursor-pointer hover:bg-gray-50"
                                                >
                                                    {category.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                    <SlidersHorizontal className="h-5 w-5 text-gray-400" />
                                    <Select
                                        value={selectedSort}
                                        onValueChange={setSelectedSort}
                                    >
                                        <SelectTrigger
                                            className={cn(
                                                "w-full sm:w-[200px] h-11",
                                                "bg-gray-50 border-gray-200",
                                                "focus:ring-2 focus:ring-primary/20",
                                                "transition-all duration-200"
                                            )}
                                        >
                                            <SelectValue placeholder="Sort by" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="popular" className="cursor-pointer hover:bg-gray-50">
                                                Most Popular
                                            </SelectItem>
                                            <SelectItem value="price_low" className="cursor-pointer hover:bg-gray-50">
                                                Price: Low to High
                                            </SelectItem>
                                            <SelectItem value="price_high" className="cursor-pointer hover:bg-gray-50">
                                                Price: High to Low
                                            </SelectItem>
                                            <SelectItem value="latest" className="cursor-pointer hover:bg-gray-50">
                                                Latest Events
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}