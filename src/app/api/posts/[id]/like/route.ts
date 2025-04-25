import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: {
        id: params.id,
      },
      include: {
        likes: {
          where: {
            userId: session.user.id,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({
      liked: post.likes.length > 0,
      likeCount: post._count.likes,
    });
  } catch (error) {
    console.error('Error fetching like status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId: params.id,
        },
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId: session.user.id,
            postId: params.id,
          },
        },
      });
    } else {
      await prisma.like.create({
        data: {
          userId: session.user.id,
          postId: params.id,
        },
      });
    }

    const likeCount = await prisma.like.count({
      where: {
        postId: params.id,
      },
    });

    return NextResponse.json({
      liked: !existingLike,
      likeCount,
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 