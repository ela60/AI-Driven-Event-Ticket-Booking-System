import prisma from "@/lib/prisma";
import UserManagementTable from "@/app/(dashboard)/dashboard/(adminDashboard)/user-management/user-table";

export default async function Users() {
    const users = await prisma.user.findMany()
    return (
        <>
            <UserManagementTable users={users}/>
        </>
    )
}