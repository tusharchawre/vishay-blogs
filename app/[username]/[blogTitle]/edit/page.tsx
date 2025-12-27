import { Editor } from '@/app/_components/DynamicEditor';
import { getPost } from '@/app/action';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/prisma';
import { decodeBlogUri } from '@/app/utils/uriParser';

type Props = {
  params: Promise<{ username: string; blogTitle: string }>;
};

const page = async ({ params }: Props) => {
  const encodedTitleWithId = (await params).blogTitle;
  const username = (await params).username;

  const { title: blogTitle, postId } = decodeBlogUri(encodedTitleWithId);

  const session = await auth();
  const post = await getPost({ postId });

  if (!post?.content) {
    return null;
  }

  const currentUser = await prisma.user.findFirst({
    where: {
      email: session?.user?.email,
    },
  });

  if (!currentUser || currentUser.id !== post.userId) {
    redirect(`/${username}/${blogTitle.replaceAll(' ', '-')}-${postId}`);
  }

  return (
    <div className="mx-auto h-fit min-h-[100vh] w-full md:max-w-[55rem] md:px-8">
      <Editor
        post={post!}
        initialContent={post?.content}
        draftImg={post?.coverImg ?? ''}
        editable={true}
      />
    </div>
  );
};

export default page;
