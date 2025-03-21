import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if like already exists
    const existingLike = await prisma.like.findFirst({
      where: {
        userId: user.id,
        postId: params.postId,
      },
    });

    if (existingLike) {
      // Unlike the post
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
      await prisma.post.update({
        where: { id: params.postId },
        data: { likes: { decrement: 1 } },
      });
      return NextResponse.json({ liked: false });
    } else {
      // Like the post
      await prisma.like.create({
        data: {
          userId: user.id,
          postId: params.postId,
        },
      });
      await prisma.post.update({
        where: { id: params.postId },
        data: { likes: { increment: 1 } },
      });
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error("Error handling like:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has liked the post
    const like = await prisma.like.findFirst({
      where: {
        userId: user.id,
        postId: params.postId,
      },
    });

    // Get total likes count
    const post = await prisma.post.findUnique({
      where: { id: params.postId },
      select: { likes: true },
    });

    return NextResponse.json({
      liked: !!like,
      likesCount: post?.likes || 0,
    });
  } catch (error) {
    console.error("Error getting like status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 