import ImageGroups from "@/components/image-groups"
import HeroImage from "@/components/hero-image"

export default function Hero() {
    return (
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 px-4 py-8 md:px-6 lg:px-8">
            <ImageGroups />
            <HeroImage />
        </div>
    )
}

