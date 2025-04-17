import React from "react";
import { Ticket, TicketCheck, CalendarDays } from "lucide-react";

const stats = [
  { icon: CalendarDays, title: "Total Events", value: "567" },
  { icon: Ticket, title: "Available Tickets", value: "9,876" },
  { icon: TicketCheck, title: "Booked Tickets", value: "9,876" },
];

const Cards = () => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mx-auto'>
      {stats.map((stat, index) => (
        <div
          key={index}
          className='bg-white border  dark:bg-neutral-800 drop-shadow-lg rounded-xl p-6 flex items-center space-x-4'
        >
          <stat.icon className='w-12 h-12 text-[var(--color-primary)]' />
          <div>
            <h3 className='text-base font-semibold text-neutral-700 dark:text-neutral-200'>
              {stat.title}
            </h3>
            <p className='text-xl font-bold text-primary'>{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Cards;
