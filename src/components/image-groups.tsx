"use client"
import {images} from "@/data/constants"
import {motion} from "motion/react"
import Image from "next/image"

export default function ImageGroups() {
    return (
        <div className="flex flex-col max-w-full lg:max-w-3/4 mb-8 lg:mb-0">
            <div className="flex flex-col mb-4 md:max-w-3/4">
                <p className="text-lg md:text-xl lg:text-2xl text-neutral-500 dark:text-neutral-100 font-semibold">
                    hundreds of events in your city
                </p>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-700 dark:text-neutral-200">
                    Find the best events and book now
                </h1>
            </div>
            <div className="flex flex-wrap">
                {images.map((image, idx) => (
                    <motion.div
                        key={"images" + idx}
                        // style={{
                        //     rotate: Math.random() * 20 - 10,
                        // }}
                        whileHover={{
                            scale: 1.1,
                            rotate: 0,
                            zIndex: 100,
                        }}
                        whileTap={{
                            scale: 1.1,
                            rotate: 0,
                            zIndex: 100,
                        }}
                        className="rounded-xl -mr-4 mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 shrink-0 overflow-hidden"
                    >
                        <Image
                            src={image || "/placeholder.svg"}
                            alt="event image"
                            width="500"
                            height="500"
                            className="rounded-lg h-16 w-16 sm:h-20 sm:w-20 md:h-28 md:w-28 lg:h-40 lg:w-40 object-cover shrink-0"
                        />
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

