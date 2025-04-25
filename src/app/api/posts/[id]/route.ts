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
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        likes: {
          where: {
            userId: session.user.id,
          },
          select: {
            id: true,
          },
        },
        bookmarks: {
          where: {
            userId: session.user.id,
          },
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        comments: {
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
        tags: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: post.id,
      username: post.user.name,
      profilePicture: post.user.image,
      imageUrl: post.imageUrl,
      caption: post.caption,
      createdAt: post.createdAt,
      likes: post._count.likes,
      isLiked: post.likes.length > 0,
      isBookmarked: post.bookmarks.length > 0,
      comments: post.comments.map(comment => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        user: {
          name: comment.user.name,
          image: comment.user.image,
        },
      })),
      tags: post.tags.map(tag => tag.name),
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 