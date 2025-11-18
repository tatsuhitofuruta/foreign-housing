import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleAPIError } from '@/lib/api-response';
import { rateLimit, RateLimits } from '@/lib/rate-limit';
import { log } from '@/lib/logger';
import { propertySearchSchema } from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    await rateLimit(request, RateLimits.moderate);

    const searchParams = request.nextUrl.searchParams;
    const rawParams = Object.fromEntries(searchParams.entries());

    // Validate and sanitize input
    const validatedParams = propertySearchSchema.parse({
      ...rawParams,
      propertyType: searchParams.getAll('propertyType'),
    });

    const {
      page,
      limit,
      query,
      propertyTypes,
      minPrice,
      maxPrice,
      bedrooms,
      prefecture,
      city,
      sortBy,
      sortOrder,
    } = validatedParams;

    // Build where clause with validated inputs
    const where = {
      status: 'PUBLISHED' as const,
      published: true,
      ...(query && {
        OR: [
          { title: { contains: query, mode: 'insensitive' as const } },
          { titleJa: { contains: query, mode: 'insensitive' as const } },
          { city: { contains: query, mode: 'insensitive' as const } },
        ],
      }),
      ...(propertyTypes && propertyTypes.length > 0 && {
        propertyType: { in: propertyTypes },
      }),
      ...(minPrice !== undefined && { price: { gte: minPrice } }),
      ...(maxPrice !== undefined && {
        price: maxPrice >= 0 ? { lte: maxPrice } : undefined,
      }),
      ...(bedrooms !== undefined && { bedrooms: { gte: bedrooms } }),
      ...(prefecture && { prefecture }),
      ...(city && { city }),
    };

    // Use transaction for consistency
    const [total, properties] = await prisma.$transaction([
      prisma.property.count({ where }),
      prisma.property.findMany({
        where,
        include: {
          reviews: {
            where: { status: 'APPROVED' },
            select: { ratingOverall: true },
          },
          _count: {
            select: {
              reviews: { where: { status: 'APPROVED' } },
              favorites: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
    ]);

    // Calculate average ratings efficiently
    const propertiesWithRatings = properties.map((property) => {
      const avgRating =
        property.reviews.length > 0
          ? property.reviews.reduce((sum, r) => sum + r.ratingOverall, 0) /
            property.reviews.length
          : null;

      const { reviews, ...propertyData } = property;

      return {
        ...propertyData,
        averageRating: avgRating ? Number(avgRating.toFixed(1)) : null,
        reviewCount: property._count.reviews,
        favoriteCount: property._count.favorites,
      };
    });

    log.info('Properties fetched', {
      total,
      page,
      limit,
      query,
    });

    return NextResponse.json(
      {
        properties: propertiesWithRatings,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error) {
    log.error('Error fetching properties', error as Error);
    return handleAPIError(error);
  }
}
