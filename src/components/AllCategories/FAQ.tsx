 "use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ = () => {
  return (
    <div className="pt-16 pb-12 grid grid-cols-1 lg:grid-cols-2 gap-8" id="FAQ">
      {/* Left Section */}
      <div>
        <h1 className="text-3xl font-bold">FAQ</h1>
        <p className="text-gray-600">
          We answer your questions, or leave your email, and our manager will contact you.
        </p>
        
        {/* Email Input Section */}
        <div className="flex items-center gap-2 mt-6">
          <Input placeholder="Your Email" className="flex-1" />
          <button className="text-primary">
            <IoIosArrowDroprightCircle className="text-4xl" />
          </button>
        </div>
      </div>

      {/* Right Section - Accordion */}
      <div>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="q1">
            <AccordionTrigger>What is your refund policy?</AccordionTrigger>
            <AccordionContent>
              We offer a full refund within 30 days of purchase if you’re not satisfied.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q2">
            <AccordionTrigger>How can I contact support?</AccordionTrigger>
            <AccordionContent>
              You can reach out to our support team via email at support@example.com.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="q3">
            <AccordionTrigger>Do you offer international shipping?</AccordionTrigger>
            <AccordionContent>
              Yes, we provide international shipping to most countries worldwide.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default FAQ;
