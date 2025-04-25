"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function getUserProfile() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      profile: true,
      posts: {
        include: {
          images: {
            orderBy: {
              order: 'asc'
            }
          },
          likes: true,
          comments: true,
        },
        orderBy: {
          createdAt: 'desc'
        }
      },
      followers: {
        include: {
          follower: {
            select: {
              name: true,
              image: true,
            }
          }
        }
      },
      following: {
        include: {
          following: {
            select: {
              name: true,
              image: true,
            }
          }
        }
      }
    }
  });

  if (!user) {
    throw new Error("User not found");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    profile: user.profile,
    posts: user.posts.map(post => ({
      ...post,
      imageUrl: post.imageUrl || post.images[0]?.imageUrl || '',
      likesCount: post.likes.length,
      commentsCount: post.comments.length,
    })),
    stats: {
      posts: user.posts.length,
      followers: user.followers.length,
      following: user.following.length,
    }
  };
}

export async function updateProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const bio = formData.get("bio") as string;
  const location = formData.get("location") as string;
  const interests = (formData.get("interests") as string).split(",").map(i => i.trim()).filter(Boolean);

  const user = await prisma.user.update({
    where: { email: session.user.email },
    data: {
      name,
      profile: {
        upsert: {
          create: {
            bio,
            location,
            interests,
          },
          update: {
            bio,
            location,
            interests,
          }
        }
      }
    }
  });

  return user;
} 