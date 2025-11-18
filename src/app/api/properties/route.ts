import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PropertyType, PropertyStatus, Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const query = searchParams.get('query') || '';
    const propertyTypes = searchParams.getAll('propertyType') as PropertyType[];
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
    const bedrooms = searchParams.get('bedrooms') ? parseInt(searchParams.get('bedrooms')!) : undefined;
    const prefecture = searchParams.get('prefecture') || undefined;
    const city = searchParams.get('city') || undefined;
    const sortBy = searchParams.get('sortBy') || 'publishedAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build where clause
    const where: Prisma.PropertyWhereInput = {
      status: PropertyStatus.PUBLISHED,
      published: true,
      ...(query && {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { titleJa: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { address: { contains: query, mode: 'insensitive' } },
          { city: { contains: query, mode: 'insensitive' } },
        ],
      }),
      ...(propertyTypes.length > 0 && { propertyType: { in: propertyTypes } }),
      ...(minPrice !== undefined && { price: { gte: minPrice } }),
      ...(maxPrice !== undefined && { price: { lte: maxPrice } }),
      ...(bedrooms !== undefined && { bedrooms: { gte: bedrooms } }),
      ...(prefecture && { prefecture }),
      ...(city && { city }),
    };

    // Get total count
    const total = await prisma.property.count({ where });

    // Get properties with pagination
    const properties = await prisma.property.findMany({
      where,
      include: {
        reviews: {
          where: { status: 'APPROVED' },
          select: {
            ratingOverall: true,
          },
        },
        _count: {
          select: {
            reviews: true,
            favorites: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    });

    // Calculate average ratings
    const propertiesWithRatings = properties.map((property) => {
      const avgRating =
        property.reviews.length > 0
          ? property.reviews.reduce((sum, r) => sum + r.ratingOverall, 0) / property.reviews.length
          : null;

      const { reviews, ...propertyData } = property;

      return {
        ...propertyData,
        averageRating: avgRating ? Number(avgRating.toFixed(1)) : null,
        reviewCount: property._count.reviews,
        favoriteCount: property._count.favorites,
      };
    });

    return NextResponse.json({
      properties: propertiesWithRatings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}
