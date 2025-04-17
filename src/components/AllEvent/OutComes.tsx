"use-client"
import React from 'react';
import { IoIosHome, IoMdMegaphone, IoMdBulb, IoMdCash } from "react-icons/io";

export default function OutComes() {
  return (
    <div className="flex items-center justify-center mt-8 p-8">
      <div className="w-full max-w-6xl">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-8">Event Outcomes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-red-400 to-orange-400 rounded-xl shadow-md">
            <IoIosHome size={48} className="text-white mb-4" />
            <h3 className="text-lg font-medium text-white">Building</h3>
          </div>
          <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-xl shadow-md">
            <IoMdMegaphone size={48} className="text-white mb-4" />
            <h3 className="text-lg font-medium text-white">Marketing</h3>
          </div>
          <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-400 to-teal-400 rounded-xl shadow-md">
            <IoMdBulb size={48} className="text-white mb-4" />
            <h3 className="text-lg font-medium text-white">Planning</h3>
          </div>
          <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl shadow-md">
            <IoMdCash size={48} className="text-white mb-4" />
            <h3 className="text-lg font-medium text-white">Monetizing</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
