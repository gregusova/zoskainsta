"use server";

import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function getPosts() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error('Not authenticated');
  }

  const posts = await prisma.post.findMany({
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      images: true,
      likes: true,
      comments: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const userLikes = await prisma.like.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      postId: true,
    },
  });

  const likedPostIds = new Set(userLikes.map((like) => like.postId));

  return posts.map((post) => ({
    ...post,
    imageUrl: post.images?.[0]?.imageUrl || '',
    likes: post.likes.length,
    comments: post.comments.length,
    isLiked: likedPostIds.has(post.id),
  }));
}

export async function createPost(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error('Not authenticated');
  }

  const caption = formData.get('caption') as string;
  const image = formData.get('image') as File;

  if (!image) {
    throw new Error('No image provided');
  }

  const bytes = await image.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Upload image to Vercel Blob
  const form = new FormData();
  form.append('file', image);

  const uploadResponse = await fetch(
    `https://api.vercel.com/v2/blobs?token=${process.env.BLOB_READ_WRITE_TOKEN}`,
    {
      method: 'POST',
      body: form,
    }
  );

  if (!uploadResponse.ok) {
    throw new Error('Failed to upload image');
  }

  const { url } = await uploadResponse.json();

  // Create post with image
  const post = await prisma.post.create({
    data: {
      caption,
      userId: session.user.id,
      images: {
        create: {
          imageUrl: url,
          order: 0,
        },
      },
    },
  });

  revalidatePath('/prispevok');
  return post;
}

export async function likePost(postId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error('Not authenticated');
  }

  const existingLike = await prisma.like.findUnique({
    where: {
      userId_postId: {
        userId: session.user.id,
        postId,
      },
    },
  });

  if (existingLike) {
    await prisma.like.delete({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId,
        },
      },
    });
  } else {
    await prisma.like.create({
      data: {
        userId: session.user.id,
        postId,
      },
    });
  }

  revalidatePath('/prispevok');
}

export async function createComment(postId: string, content: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error('Not authenticated');
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      userId: session.user.id,
      postId,
    },
  });

  revalidatePath('/prispevok');
  return comment;
}

export async function deleteComment(commentId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error('Not authenticated');
  }

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: { post: true },
  });

  if (!comment) {
    throw new Error('Comment not found');
  }

  if (comment.userId !== session.user.id) {
    throw new Error('Not authorized');
  }

  await prisma.comment.delete({
    where: { id: commentId },
  });

  revalidatePath('/prispevok');
}

export async function editComment(commentId: string, content: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error('Not authenticated');
  }

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: { post: true },
  });

  if (!comment) {
    throw new Error('Comment not found');
  }

  if (comment.userId !== session.user.id) {
    throw new Error('Not authorized');
  }

  const updatedComment = await prisma.comment.update({
    where: { id: commentId },
    data: {
      content,
      edited: true,
    },
  });

  revalidatePath('/prispevok');
  return updatedComment;
}

export async function bookmarkPost(postId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error('Not authenticated');
  }

  const existingBookmark = await prisma.bookmark.findUnique({
    where: {
      userId_postId: {
        userId: session.user.id,
        postId,
      },
    },
  });

  if (existingBookmark) {
    await prisma.bookmark.delete({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId,
        },
      },
    });
  } else {
    await prisma.bookmark.create({
      data: {
        userId: session.user.id,
        postId,
      },
    });
  }

  revalidatePath('/prispevok');
} 