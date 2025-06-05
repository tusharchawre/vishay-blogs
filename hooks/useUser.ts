import { auth } from "@/auth"
import { prisma } from "@/prisma"

export const getUser = async () => {
    const session = await auth()

    const user = await prisma.user.findFirst({
        where: {
            email: session?.user?.email
        }
    })

    return user
}