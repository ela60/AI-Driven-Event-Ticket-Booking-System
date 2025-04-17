import {
    BadgeDollarSign,
    CalendarClock,
    CheckCircle,
    LayoutDashboard,
    Ticket,
    TicketCheckIcon,
    User,
    Users,
} from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useSession} from "next-auth/react";

export const enum UserRole {
    ORGANIZER = "ORGANIZER",
    ADMIN = "ADMIN",
    USER = "USER",
}

const navData = {
    adminNav: [
        {
            title: "Create Event",
            url: "/dashboard/create-event",
            icon: CalendarClock,
        },
        {
            title: "Event Management",
            url: "/dashboard/event-management",
            icon: CalendarClock,
        },
        {
            title: "Booked Ticket Management",
            url: "/dashboard/ticket-management",
            icon: TicketCheckIcon,
        },
        {
            title: "User Management",
            url: "/dashboard/user-management",
            icon: Users,
        },
        {
            title: "Profile",
            url: "/dashboard/profile",
            icon: User,
        },
    ],
    userNav: [
        {
            title: "My Tickets",
            url: "/dashboard/my-ticket",
            icon: Ticket,
        },
        {
            title: "Ticket Validation",
            url: "/dashboard/ticket-validation",
            icon: CheckCircle,
        },
        {
            title: "Payment History",
            url: "/dashboard/payment-history",
            icon: BadgeDollarSign,
        },
        {
            title: "Profile",
            url: "/dashboard/profile",
            icon: User,
        },
    ],

};

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    const {data: session} = useSession();
    const pathname = usePathname();

    const role: UserRole = session?.user?.role;
    const navLinks = role === "ORGANIZER" ? navData.adminNav : navData.userNav;

    // Check if a link is active
    const isActiveLink = (href: string) => {
        return pathname === href
            ? "text-[var(--color-primary)] bg-[var(--color-primary)]/10"
            : "text-gray-700 hover:text-[var(--color-primary)] hover:bg-gray-100";
    };
    return (
        <Sidebar variant='floating' {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size='lg' asChild>
                            <Link href='/'>
                                <Ticket
                                    size={48}
                                    className='w-8 h-8 text-[var(--color-primary)]'
                                />
                                <span>TicketHub</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    {session?.user && (
                        <SidebarMenu className='gap-2'>
                            {/* dashboard route only */}
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    className='hover:text-[var(--color-primary)]'
                                >
                                    <Link
                                        href='/dashboard'
                                        className={`${isActiveLink(
                                            "/dashboard"
                                        )} ont-medium text-[16px]`}
                                    >
                                        <LayoutDashboard className='size-6'/>
                                        <span>Dashboard</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            {
                                navLinks.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            className='hover:text-[var(--color-primary)]'
                                        >
                                            <Link
                                                href={item.url}
                                                className={`${isActiveLink(
                                                    item.url
                                                )} ont-medium text-[16px]`}
                                            >
                                                <item.icon className='size-6'/>
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))
                            }


                        </SidebarMenu>
                    )}
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
