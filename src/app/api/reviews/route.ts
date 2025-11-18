import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const reviewSchema = z.object({
  propertyId: z.string(),
  ratingOverall: z.number().min(1).max(5),
  ratingLocation: z.number().min(1).max(5),
  ratingFacilities: z.number().min(1).max(5),
  ratingManagement: z.number().min(1).max(5),
  ratingValue: z.number().min(1).max(5),
  title: z.string().min(5).max(200),
  comment: z.string().min(20).max(2000),
  images: z.array(z.string()).optional(),
  moveInDate: z.string().optional(),
  moveOutDate: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = reviewSchema.parse(body);

    // Check if user already reviewed this property
    const existingReview = await prisma.review.findFirst({
      where: {
        propertyId: validatedData.propertyId,
        userId: session.user.id,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this property' },
        { status: 400 }
      );
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        ...validatedData,
        userId: session.user.id,
        moveInDate: validatedData.moveInDate ? new Date(validatedData.moveInDate) : null,
        moveOutDate: validatedData.moveOutDate ? new Date(validatedData.moveOutDate) : null,
        status: 'PENDING', // Reviews need approval
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}
