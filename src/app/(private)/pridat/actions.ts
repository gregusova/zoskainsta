"use server";

import { put } from "@vercel/blob";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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

    const file = formData.get("image") as File;
    const caption = formData.get("caption") as string;
    const tagsString = formData.get("tags") as string;
    const tags = tagsString.split(",").map(tag => tag.trim()).filter(Boolean);

    if (!file) {
      throw new Error("No image provided");
    }

    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: 'public',
    });

    // Create post with image
    const post = await prisma.post.create({
      data: {
        userId: user.id,
        caption: caption || null,
        tags: tags,
        images: {
          create: {
            imageUrl: blob.url,
            order: 0,
          },
        },
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