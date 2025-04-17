"use client";
import AdminDashboard from "@/components/dashboard/admindashboard/AdminDashboard";
import UserDashboard from "@/components/dashboard/userdashboard/UserDashboard";
import { useSession } from "next-auth/react";
import React from "react";

const DashboardPage = () => {
  const { data: session } = useSession();
  console.log(session?.user, "session data");
  // const userRole: string = session?.user?.role;
  const userRole: string = "user";
  return (
    <div className='w-full p-6'>
      <h1 className='text-2xl font-bold pb-4'>Dashboard</h1>
      {userRole === "admin" ? (
        <AdminDashboard/>
      ) : userRole === "user" ? (
        <UserDashboard/>
      ) : null}{" "}
    </div>
  );
};

export default DashboardPage;
