import React from 'react';
import { Users, Ticket, Calendar } from "lucide-react";

const stats = [
    { icon: Users, title: "Total Users", value: "12,345" },
    { icon: Calendar, title: "Total Events", value: "567" },
    { icon: Ticket, title: "Tickets Sold", value: "9,876" },
];

const Statistics = () => {
    return (
        <div className="py-12 pt-16" id='statistics'>
            <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-700 dark:text-neutral-200 mb-3">
                Platform Statistics
                </h2>
                <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">
                Get insights into our growing community and event engagement.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white dark:bg-neutral-800 shadow-lg rounded-xl p-6 flex items-center space-x-4">
                        <stat.icon className="w-12 h-12 text-[var(--color-primary)]" />
                        <div>
                            <h3 className="text-xl font-semibold text-neutral-700 dark:text-neutral-200">{stat.title}</h3>
                            <p className="text-2xl font-bold text-primary">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Statistics;
