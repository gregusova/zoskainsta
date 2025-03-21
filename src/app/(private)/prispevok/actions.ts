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
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return posts.map((post: Post) => ({
    ...post,
    likes: post.likes.length,
    comments: post.comments.length,
    isLiked: userId ? post.likes.some(like => like.userId === userId) : false,
  }));
} 