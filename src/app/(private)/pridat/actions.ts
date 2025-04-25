"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";

export async function createPost(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const file = formData.get("image");
    const caption = formData.get("caption") as string;
    const tagsString = formData.get("tags") as string;
    const tags = tagsString.split(",").map(tag => tag.trim()).filter(Boolean);

    if (!file || !(file instanceof File)) {
      throw new Error("No valid image provided");
    }

    // Generate a unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
      addRandomSuffix: true,
    });

    if (!blob?.url) {
      throw new Error('Failed to upload image');
    }

    // Create post with image
    const post = await prisma.post.create({
      data: {
        userId: user.id,
        caption: caption || null,
        tags: tags,
        imageUrl: blob.url,
        images: {
          create: {
            imageUrl: blob.url,
            order: 0,
          },
        },
      },
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
    });

    revalidatePath('/prispevok');
    revalidatePath('/profil');
    
    return { success: true, post };
  } catch (error) {
    console.error("[CREATE_POST]", error);
    return { success: false, error: (error as Error).message };
  }
} 