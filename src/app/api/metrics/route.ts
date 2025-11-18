import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [
      totalProperties,
      publishedProperties,
      totalReviews,
      approvedReviews,
      totalUsers,
      activeUsers,
    ] = await Promise.all([
      prisma.property.count(),
      prisma.property.count({ where: { status: 'PUBLISHED' } }),
      prisma.review.count(),
      prisma.review.count({ where: { status: 'APPROVED' } }),
      prisma.user.count(),
      prisma.user.count({
        where: {
          updatedAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days
          },
        },
      }),
    ]);

    // Get average ratings
    const averageRatings = await prisma.review.aggregate({
      where: { status: 'APPROVED' },
      _avg: {
        ratingOverall: true,
        ratingLocation: true,
        ratingFacilities: true,
        ratingManagement: true,
        ratingValue: true,
      },
    });

    const metrics = {
      timestamp: new Date().toISOString(),
      properties: {
        total: totalProperties,
        published: publishedProperties,
        draft: totalProperties - publishedProperties,
      },
      reviews: {
        total: totalReviews,
        approved: approvedReviews,
        pending: totalReviews - approvedReviews,
        averageRatings: {
          overall: Number(averageRatings._avg.ratingOverall?.toFixed(2)) || 0,
          location: Number(averageRatings._avg.ratingLocation?.toFixed(2)) || 0,
          facilities: Number(averageRatings._avg.ratingFacilities?.toFixed(2)) || 0,
          management: Number(averageRatings._avg.ratingManagement?.toFixed(2)) || 0,
          value: Number(averageRatings._avg.ratingValue?.toFixed(2)) || 0,
        },
      },
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: totalUsers - activeUsers,
      },
    };

    return NextResponse.json(metrics, {
      headers: {
        'Cache-Control': 'private, s-maxage=300',
      },
    });
  } catch (error) {
    console.error('Metrics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}
