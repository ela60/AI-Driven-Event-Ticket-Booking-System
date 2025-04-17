import Image from "next/image"
import { images } from "@/data/constants"
import { Button } from "@/components/ui/button"

export default function HeroImage() {
    return (
        <div className="relative w-full max-w-md mx-auto lg:mx-0">
            <Image
                src={images[3] || "/placeholder.svg"}
                alt="hero image"
                width={450}
                height={900}
                className="rounded-lg w-full h-auto object-cover"
            />

            {/* Responsive button positioning */}
            <div className="absolute top-0 left-0 w-full h-full">
                <Button
                    variant="outline"
                    className="text-gray-800 absolute top-[10%] left-[-5%] sm:left-[-10%] border border-pink-300 text-xs sm:text-sm whitespace-nowrap"
                >
                    Select date and register
                </Button>

                <Button
                    variant="outline"
                    className="text-gray-800 absolute top-[40%] right-[-5%] sm:right-0 border border-pink-300 text-xs sm:text-sm whitespace-nowrap"
                >
                    Browser list of events
                </Button>

                <Button
                    variant="outline"
                    className="text-gray-800 absolute bottom-[10%] left-[5%] border border-pink-300 bg-gradient-to-r from-pink-200 to-pink-50 text-xs sm:text-sm"
                >
                    Come and enjoy
                </Button>
            </div>
        </div>
    )
}

