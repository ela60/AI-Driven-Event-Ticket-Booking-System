"use server"

import prisma from "@/lib/prisma";





export async function deleteUser(id: string) {
    console.log(id)
    const response = await prisma.user.delete({
        where: {id: id}
    })

    console.log(response)
}