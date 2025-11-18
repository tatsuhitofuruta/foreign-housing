import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if already marked as helpful
    const existing = await prisma.reviewHelpful.findUnique({
      where: {
        reviewId_userId: {
          reviewId: params.id,
          userId: session.user.id,
        },
      },
    });

    if (existing) {
      // Remove helpful mark
      await prisma.reviewHelpful.delete({
        where: {
          id: existing.id,
        },
      });

      // Decrement helpful count
      await prisma.review.update({
        where: { id: params.id },
        data: { helpfulCount: { decrement: 1 } },
      });

      return NextResponse.json({ helpful: false });
    } else {
      // Add helpful mark
      await prisma.reviewHelpful.create({
        data: {
          reviewId: params.id,
          userId: session.user.id,
        },
      });

      // Increment helpful count
      await prisma.review.update({
        where: { id: params.id },
        data: { helpfulCount: { increment: 1 } },
      });

      return NextResponse.json({ helpful: true });
    }
  } catch (error) {
    console.error('Error toggling helpful:', error);
    return NextResponse.json(
      { error: 'Failed to toggle helpful' },
      { status: 500 }
    );
  }
}
