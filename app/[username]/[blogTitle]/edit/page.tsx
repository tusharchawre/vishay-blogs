import { Editor } from "@/app/_components/DynamicEditor"
import { getPost } from "@/app/action"
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/prisma";

type Props = {
    params: Promise<{ username: string; blogTitle: string }>
}

const page = async ({ params }: Props) => {
    const encodedTitleWithId = (await params).blogTitle
    const username = (await params).username

    const lastDashIndex = encodedTitleWithId.lastIndexOf('-')
    const postId = encodedTitleWithId.substring(lastDashIndex + 1)
    const blogTitle = encodedTitleWithId.substring(0, lastDashIndex).replaceAll("-", " ")

    const session = await auth()
    const post = await getPost({ username, blogTitle, postId })

    if (!post?.content) {
        return null
    }

    const currentUser = await prisma.user.findFirst({
        where: {
            email: session?.user?.email
        }
    })

    if (!currentUser || currentUser.id !== post.userId) {
        redirect(`/${username}/${blogTitle.replaceAll(" ", "-")}-${postId}`)
    }

    return (
        <div className="w-full mx-auto md:max-w-[55rem] min-h-[100vh] h-fit md:px-8">
            <Editor
                post={post!}
                initialContent={post?.content}
                draftImg={post?.coverImg ?? ""}
                editable={true}
            />
        </div>
    )
}

export default page