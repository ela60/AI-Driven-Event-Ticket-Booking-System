"use client";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import {Separator} from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React, {useEffect, useState} from "react";
import {usePathname} from "next/navigation";
import Link from "next/link";
import {AppSidebar} from "@/components/dashboard/app-sidebar";
import "@/app/globals.css";
import {Toaster} from "sonner";
import {SessionProvider} from "next-auth/react";

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    const [pathSegments, setPathSegments] = useState<string[]>([]); // State to store path segments
    const pathname = usePathname(); // Get current path
    useEffect(() => {
        setPathSegments(pathname.split("/").filter((segment) => segment)); // Update state only on client
    }, [pathname]);

    return (
        <SessionProvider>
            <html>
            <body>
            <SidebarProvider>
                <AppSidebar/>
                <SidebarInset>
                    <header className='flex h-16 shrink-0 items-center gap-2 border-b'>
                        <div className='flex items-center gap-2 px-3'>
                            <SidebarTrigger/>
                            <Separator orientation='vertical' className='mr-2 h-4'/>
                            <Breadcrumb>
                                <BreadcrumbList>
                                    {/* <BreadcrumbItem className='hidden md:block'>
                      <BreadcrumbLink href='/'>
                        AI-Driven Ticket Booking System
                      </BreadcrumbLink>
                    </BreadcrumbItem>

                    {pathSegments.length > 0 && (
                      <BreadcrumbSeparator className='hidden md:block' />
                    )} */}

                                    {pathSegments.map((segment, index) => {
                                        const isLast = index === pathSegments.length - 1;
                                        const href = `/${pathSegments
                                            .slice(0, index + 1)
                                            .join("/")}`;
                                        const formattedSegment =
                                            segment.charAt(0).toUpperCase() + segment.slice(1);

                                        return (
                                            <React.Fragment key={href}>
                                                <BreadcrumbItem>
                                                    {isLast ? (
                                                        <BreadcrumbPage>
                                                            {formattedSegment}
                                                        </BreadcrumbPage>
                                                    ) : (
                                                        <BreadcrumbLink asChild>
                                                            <Link href={href}>{formattedSegment}</Link>
                                                        </BreadcrumbLink>
                                                    )}
                                                </BreadcrumbItem>
                                                {!isLast && <BreadcrumbSeparator/>}
                                            </React.Fragment>
                                        );
                                    })}
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>
                    <Toaster richColors/>

                    <main>{children}</main>
                </SidebarInset>
            </SidebarProvider>
            </body>
            </html>

        </SessionProvider>

    );
}
