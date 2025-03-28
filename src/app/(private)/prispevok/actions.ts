"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

type Post = {
  id: string;
  userId: string;
  imageUrl: string;
  caption: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    name: string | null;
    image: string | null;
  };
  likes: { userId: string }[];
  comments: { id: string }[];
  images?: {
    imageUrl: string;
    order: number;
  }[];
};

export async function getPosts() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.email ? (await prisma.user.findUnique({ where: { email: session.user.email } }))?.id : null;

  const posts = await prisma.post.findMany({
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      likes: true,
      comments: true,
      images: {
        select: {
          imageUrl: true,
          order: true,
        },
        orderBy: {
          order: 'asc'
        },
        take: 1
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return posts.map((post: Post) => ({
    ...post,
    imageUrl: post.images?.[0]?.imageUrl || '',
    likes: post.likes.length,
    comments: post.comments.length,
    isLiked: userId ? post.likes.some(like => like.userId === userId) : false,
  }));
} 