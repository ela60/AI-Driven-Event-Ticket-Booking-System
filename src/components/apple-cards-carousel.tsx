"use client";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTicketAlt,
} from "react-icons/fa";

import React, {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext
} from "react";
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconX,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import Image, { ImageProps } from "next/image";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { JSX } from "react/jsx-runtime";

interface CarouselProps {
  items: JSX.Element[];
  initialScroll?: number;
}

type Card = {
  src: string;
  title: string;
  category: string;
  content?: React.ReactNode;
  date: string;
  description: string;
  location: string;
  ticketsSold: number;
};

export const CarouselContext = createContext<{
  onCardClose: (index: number) => void;
  currentIndex: number;
}>({
  onCardClose: () => {},
  currentIndex: 0,
});

export const Carousel = ({ items, initialScroll = 0 }: CarouselProps) => {
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
  }, [initialScroll]);

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const handleCardClose = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = isMobile() ? 230 : 384; // (md:w-96)
      const gap = isMobile() ? 4 : 8;
      const scrollPosition = (cardWidth + gap) * (index + 1);
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  const isMobile = () => {
    return window && window.innerWidth < 768;
  };

  return (
    <CarouselContext.Provider
      value={{ onCardClose: handleCardClose, currentIndex }}
    >
      <div className="relative w-full">
        <div
          className="flex w-full overflow-x-scroll overscroll-x-auto py-10 md:py-20 scroll-smooth [scrollbar-width:none]"
          ref={carouselRef}
          onScroll={checkScrollability}
        >
          <div
            className={cn(
              "absolute right-0  z-[1000] h-auto  w-[5%] overflow-hidden bg-gradient-to-l"
            )}
          ></div>

          <div
            className={cn(
              "flex flex-row justify-start gap-4 pl-4",
              "max-w-7xl mx-auto" // remove max-w-4xl if you want the carousel to span the full width of its container
            )}
          >
            {items.map((item, index) => (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: 0.2 * index,
                    ease: "easeOut",
                    once: true,
                  },
                }}
                key={"card" + index}
                className="last:pr-[5%] md:last:pr-[33%]  rounded-3xl"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2 mr-10">
          <button
            className="relative z-40 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center disabled:opacity-50"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
          >
            <IconArrowNarrowLeft className="h-6 w-6 text-gray-500" />
          </button>
          <button
            className="relative z-40 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center disabled:opacity-50"
            onClick={scrollRight}
            disabled={!canScrollRight}
          >
            <IconArrowNarrowRight className="h-6 w-6 text-gray-500" />
          </button>
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

export const Card = ({
  card,
  index,
  layout = false,
}: {
  card: Card;
  index: number;
  layout?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { onCardClose } = useContext(CarouselContext);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleClose();
      }
    }

    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useOutsideClick(containerRef as React.RefObject<HTMLDivElement>, () => handleClose());

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onCardClose(index);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 h-screen z-50 overflow-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-black/80 backdrop-blur-lg h-full w-full fixed inset-0"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              ref={containerRef}
              className="max-w-5xl mx-auto bg-white dark:bg-neutral-900 p-10 rounded-3xl relative"
            >
              <button
                className="absolute top-4 right-4 bg-black dark:bg-white rounded-full p-2"
                onClick={handleClose}
              >
                <IconX className="h-6 w-6 text-white dark:text-black" />
              </button>
              <p className="text-lg font-semibold text-gray-700 dark:text-white">
                {card.category}
              </p>
              <h2 className="text-3xl font-bold mt-2 dark:text-white">
                {card.title}
              </h2>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                {card.description}
              </p>
              <p className="mt-4 font-medium">
                📅 {card.date} | 📍 {card.location}
              </p>
              <p className="mt-4 font-medium">
                Tickets Sold: {card.ticketsSold}
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <motion.button
        layoutId={layout ? `card-${card.title}` : undefined}
        onClick={handleOpen}
        className="rounded-3xl bg-gray-100 dark:bg-neutral-900 h-80 w-60 md:h-[40rem] md:w-96 overflow-hidden flex flex-col items-start justify-start relative z-10 shadow-xl transition-all duration-300 hover:scale-105 group"
      >
        {/* Dark gradient overlay */}
        <div className="absolute h-full top-0 inset-x-0 bg-gradient-to-b from-black/80 via-black/60 to-transparent z-20 pointer-events-none" />

        {/* Content Section */}
        <div className="relative z-30 p-6 md:p-8 flex flex-col flex-grow">
          <motion.p
            layoutId={layout ? `category-${card.category}` : undefined}
            className="text-white text-sm md:text-base font-medium font-sans text-left uppercase tracking-wide"
          >
            {card.category}
          </motion.p>

          <motion.p
            layoutId={layout ? `title-${card.title}` : undefined}
            className="text-white text-xl md:text-4xl font-semibold max-w-xs text-left font-sans md:mt-2"
          >
            {card.title}
          </motion.p>

          <motion.p className="text-white text-left text-sm md:text-base font-sans flex md:mt-4">
           {card.description}
          </motion.p>

          {/* Empty space to push the date/location section down */}
          <div className="flex-grow" />

          {/* Date, Location Section */}
          <div className="bg-black/60 rounded-xl p-2 md:p-4 mt-auto md:space-y-2">
            <motion.p className="text-white text-sm md:text-base font-sans flex items-center">
              <FaCalendarAlt className="mr-2" />{" "}
              <span className="font-semibold">{card.date}</span>
            </motion.p>
            <motion.p className="text-white text-sm md:text-base font-sans flex items-center">
              <FaMapMarkerAlt className="mr-2" />{" "}
              <span className="font-semibold">{card.location}</span>
            </motion.p>
          </div>

          {/* Tickets Sold Section */}
          <motion.div className="text-primary font-medium bg-[var(--color-primary)]/90 md:py-4 px-6 text-sm md:text-base font-sans mt-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FaTicketAlt className="text-2xl" />
              <span>{card.ticketsSold} Tickets Sold</span>
            </div>
            
          </motion.div>
        </div>

        {/* Image Background */}
        <BlurImage
          src={card.src}
          alt={card.title}
          fill
          className="object-cover absolute z-10 inset-0 transition-opacity duration-300 group-hover:opacity-80"
        />
      </motion.button>
    </>
  );
};

export const BlurImage = ({
  height,
  width,
  src,
  className,
  alt,
  ...rest
}: ImageProps) => {
  const [isLoading, setLoading] = useState(true);
  return (
    <Image
      className={cn(
        "transition duration-300",
        isLoading ? "blur-sm" : "blur-0",
        className
      )}
      onLoad={() => setLoading(false)}
      src={src}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      placeholder="blur"
      blurDataURL={typeof src === "string" ? src : undefined}
      alt={alt ? alt : "Background of a beautiful view"}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      {...rest}
    />
  );
};
