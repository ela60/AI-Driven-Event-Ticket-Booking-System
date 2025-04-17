"use client"

import Link from "next/link"
import { Ticket, Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
    return (

        <footer className="bg-slate-950 text-slate-200 pt-16 pb-8 w-full">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <Ticket className="w-8 h-8 text-primary" />
                            <h2 className="text-2xl font-bold text-white">TicketHub</h2>
                        </div>
                        <p className="text-slate-400 max-w-xs">
                            Experience seamless ticket booking with AI-driven personalized event recommendations.
                        </p>

                    </div>

                    <div className="md:mx-auto">
                        <h3 className="text-lg font-semibold mb-4 text-white">Events</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="#upcoming-events" className="text-slate-400 hover:text-primary transition-colors">
                                    Upcoming Events
                                </Link>
                            </li>
                            <li>
                                <Link href="#popular-events" className="text-slate-400 hover:text-primary transition-colors">
                                    Popular Events
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-slate-400 hover:text-primary transition-colors">
                                    AI-Powered Suggestions
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-slate-400 hover:text-primary transition-colors">
                                    VIP Access
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="md:mx-auto">
                        <h3 className="text-lg font-semibold mb-4 text-white">Support</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="#FAQ" className="text-slate-400 hover:text-primary transition-colors">
                                    FAQs
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-slate-400 hover:text-primary transition-colors">
                                    Customer Support
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-slate-400 hover:text-primary transition-colors">
                                    Refund Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="md:mx-auto">
                        <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="#" className="text-slate-400 hover:text-primary transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="#statistics" className="text-slate-400 hover:text-primary transition-colors">
                                    Statistics
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-slate-400 hover:text-primary transition-colors">
                                    AI Technology
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="md:mx-auto">
                        <h3 className="text-lg font-semibold mb-4 text-white">Follow Us</h3>
                        <div className="flex space-x-4">
                            <Link href="#" className="text-slate-400 hover:text-primary transition-colors" aria-label="Facebook">
                                <Facebook className="w-6 h-6" />
                            </Link>
                            <Link href="#" className="text-slate-400 hover:text-primary transition-colors" aria-label="Instagram">
                                <Instagram className="w-6 h-6" />
                            </Link>
                            <Link href="#" className="text-slate-400 hover:text-primary transition-colors" aria-label="Twitter">
                                <Twitter className="w-6 h-6" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 mt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-slate-400 text-sm mb-4 md:mb-0">
                            &copy; {new Date().getFullYear()} <span className="font-semibold text-white">TicketHub</span>. All rights
                            reserved.
                        </p>
                        <p className="text-slate-400 text-sm">
                            Powered by <span className="text-white font-semibold">AI-Driven Booking</span> for a smarter experience.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

