import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: params.id },
      include: {
        reviews: {
          where: { status: 'APPROVED' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            _count: {
              select: {
                helpful: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            reviews: true,
            favorites: true,
          },
        },
      },
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await prisma.property.update({
      where: { id: params.id },
      data: { viewCount: { increment: 1 } },
    });

    // Calculate average ratings
    const avgRating =
      property.reviews.length > 0
        ? property.reviews.reduce((sum, r) => sum + r.ratingOverall, 0) /
          property.reviews.length
        : null;

    const avgLocation =
      property.reviews.length > 0
        ? property.reviews.reduce((sum, r) => sum + r.ratingLocation, 0) /
          property.reviews.length
        : null;

    const avgFacilities =
      property.reviews.length > 0
        ? property.reviews.reduce((sum, r) => sum + r.ratingFacilities, 0) /
          property.reviews.length
        : null;

    const avgManagement =
      property.reviews.length > 0
        ? property.reviews.reduce((sum, r) => sum + r.ratingManagement, 0) /
          property.reviews.length
        : null;

    const avgValue =
      property.reviews.length > 0
        ? property.reviews.reduce((sum, r) => sum + r.ratingValue, 0) /
          property.reviews.length
        : null;

    // Format reviews
    const reviews = property.reviews.map((review) => ({
      ...review,
      userName: review.user.name,
      userAvatar: review.user.image,
      helpfulCount: review._count.helpful,
    }));

    return NextResponse.json({
      ...property,
      averageRating: avgRating ? Number(avgRating.toFixed(1)) : null,
      averageRatings: {
        location: avgLocation ? Number(avgLocation.toFixed(1)) : null,
        facilities: avgFacilities ? Number(avgFacilities.toFixed(1)) : null,
        management: avgManagement ? Number(avgManagement.toFixed(1)) : null,
        value: avgValue ? Number(avgValue.toFixed(1)) : null,
      },
      reviewCount: property._count.reviews,
      favoriteCount: property._count.favorites,
      reviews,
    });
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    );
  }
}
