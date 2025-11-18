import { PrismaClient, PropertyType, PropertyStatus, ReviewStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create sample users
  const user1 = await prisma.user.upsert({
    where: { email: 'john.doe@example.com' },
    update: {},
    create: {
      email: 'john.doe@example.com',
      name: 'John Doe',
      locale: 'en',
      emailVerified: new Date(),
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'tanaka.yuki@example.com' },
    update: {},
    create: {
      email: 'tanaka.yuki@example.com',
      name: '田中 結希',
      locale: 'ja',
      emailVerified: new Date(),
    },
  });

  console.log('✅ Created users');

  // Create sample properties
  const property1 = await prisma.property.create({
    data: {
      title: 'Modern Apartment in Shibuya',
      titleJa: '渋谷のモダンアパート',
      description: 'Beautiful modern apartment with great access to Shibuya station. Features high ceilings, large windows with natural light, and modern appliances. Perfect for professionals or small families.',
      descriptionJa: '渋谷駅へのアクセスが良い美しいモダンアパート。高い天井、自然光の入る大きな窓、最新の設備が特徴です。プロフェッショナルや小家族に最適です。',
      price: 180000,
      currency: 'JPY',
      propertyType: PropertyType.APARTMENT,
      bedrooms: 2,
      bathrooms: 1,
      areaSqm: 55.0,
      yearBuilt: 2020,
      floor: 5,
      totalFloors: 10,
      address: '1-1-1 Shibuya, Shibuya-ku, Tokyo 150-0002',
      latitude: 35.6595,
      longitude: 139.7004,
      prefecture: 'Tokyo',
      city: 'Shibuya',
      ward: 'Shibuya-ku',
      postalCode: '150-0002',
      stationNearest: 'Shibuya Station',
      stationLine: 'JR Yamanote Line',
      stationWalkMinutes: 5,
      images: ['/images/property-1.jpg', '/images/property-2.jpg'],
      amenities: ['Elevator', 'Balcony', 'Air Conditioning', 'Heating', 'Storage', 'Internet'],
      tags: ['Pet Friendly', 'Recently Renovated', 'Near Station'],
      status: PropertyStatus.PUBLISHED,
      published: true,
      publishedAt: new Date(),
      slug: 'modern-apartment-shibuya',
      metaTitle: 'Modern 2BR Apartment in Shibuya | Foreign Housing',
      metaDescription: 'Beautiful 2 bedroom apartment in Shibuya, Tokyo. 5 minutes from station.',
    },
  });

  const property2 = await prisma.property.create({
    data: {
      title: 'Cozy Studio near Shinjuku',
      titleJa: '新宿近くの居心地の良いワンルーム',
      description: 'Perfect for singles, close to shopping and dining. Compact yet functional design with all necessary amenities.',
      descriptionJa: 'シングルに最適、ショッピングや食事に便利。コンパクトながら機能的なデザインで、必要な設備が全て揃っています。',
      price: 120000,
      currency: 'JPY',
      propertyType: PropertyType.STUDIO,
      bedrooms: 1,
      bathrooms: 1,
      areaSqm: 28.0,
      yearBuilt: 2018,
      floor: 3,
      totalFloors: 8,
      address: '2-2-2 Shinjuku, Shinjuku-ku, Tokyo 160-0022',
      latitude: 35.6938,
      longitude: 139.7034,
      prefecture: 'Tokyo',
      city: 'Shinjuku',
      ward: 'Shinjuku-ku',
      postalCode: '160-0022',
      stationNearest: 'Shinjuku Station',
      stationLine: 'JR Yamanote Line',
      stationWalkMinutes: 8,
      images: ['/images/property-3.jpg'],
      amenities: ['Air Conditioning', 'Internet', 'Storage'],
      tags: ['Affordable', 'Convenient Location'],
      status: PropertyStatus.PUBLISHED,
      published: true,
      publishedAt: new Date(),
      slug: 'cozy-studio-shinjuku',
      metaTitle: 'Cozy Studio near Shinjuku Station | Foreign Housing',
      metaDescription: 'Affordable studio apartment near Shinjuku. Perfect for singles.',
    },
  });

  const property3 = await prisma.property.create({
    data: {
      title: 'Spacious House in Setagaya',
      titleJa: '世田谷の広々とした一戸建て',
      description: 'Family-friendly house with garden. Quiet residential area with good schools nearby. Large living spaces and private garden.',
      descriptionJa: '庭付きのファミリー向け一戸建て。静かな住宅街で近くに良い学校があります。広いリビングスペースとプライベートガーデン付き。',
      price: 350000,
      currency: 'JPY',
      propertyType: PropertyType.HOUSE,
      bedrooms: 4,
      bathrooms: 2,
      areaSqm: 120.0,
      yearBuilt: 2015,
      address: '3-3-3 Setagaya, Setagaya-ku, Tokyo 154-0017',
      latitude: 35.6464,
      longitude: 139.6533,
      prefecture: 'Tokyo',
      city: 'Setagaya',
      ward: 'Setagaya-ku',
      postalCode: '154-0017',
      stationNearest: 'Sangen-jaya Station',
      stationLine: 'Tokyu Den-en-toshi Line',
      stationWalkMinutes: 12,
      images: ['/images/property-4.jpg', '/images/property-5.jpg'],
      amenities: ['Garden', 'Parking', 'Storage', 'Air Conditioning', 'Heating'],
      tags: ['Family Friendly', 'Garden', 'Quiet Area'],
      status: PropertyStatus.PUBLISHED,
      published: true,
      publishedAt: new Date(),
      slug: 'spacious-house-setagaya',
      metaTitle: 'Spacious 4BR House in Setagaya | Foreign Housing',
      metaDescription: 'Beautiful family house with garden in Setagaya, Tokyo.',
    },
  });

  console.log('✅ Created properties');

  // Create sample reviews
  await prisma.review.create({
    data: {
      propertyId: property1.id,
      userId: user1.id,
      ratingOverall: 5,
      ratingLocation: 5,
      ratingFacilities: 5,
      ratingManagement: 4,
      ratingValue: 4,
      title: 'Perfect location and great amenities',
      comment: 'I have been living here for 6 months and absolutely love it. The location is unbeatable - just 5 minutes from Shibuya station. The apartment is clean, modern, and well-maintained. The building management is responsive and helpful.',
      isVerified: true,
      moveInDate: new Date('2024-01-01'),
      status: ReviewStatus.APPROVED,
    },
  });

  await prisma.review.create({
    data: {
      propertyId: property1.id,
      userId: user2.id,
      ratingOverall: 4,
      ratingLocation: 5,
      ratingFacilities: 4,
      ratingManagement: 4,
      ratingValue: 3,
      title: 'Great apartment but a bit pricey',
      comment: 'The apartment is very nice and the location is excellent. However, I think the rent is a bit high for the size. Overall still satisfied with my choice.',
      isVerified: true,
      moveInDate: new Date('2024-02-15'),
      status: ReviewStatus.APPROVED,
    },
  });

  await prisma.review.create({
    data: {
      propertyId: property2.id,
      userId: user1.id,
      ratingOverall: 4,
      ratingLocation: 5,
      ratingFacilities: 3,
      ratingManagement: 4,
      ratingValue: 5,
      title: 'Good value for money',
      comment: 'Perfect for a single person. The location is amazing and the price is reasonable. The space is small but efficiently designed.',
      isVerified: true,
      moveInDate: new Date('2024-03-01'),
      status: ReviewStatus.APPROVED,
    },
  });

  await prisma.review.create({
    data: {
      propertyId: property3.id,
      userId: user2.id,
      ratingOverall: 5,
      ratingLocation: 4,
      ratingFacilities: 5,
      ratingManagement: 5,
      ratingValue: 4,
      title: 'Perfect family home',
      comment: 'We moved here with our two kids and it has been wonderful. The garden is great for children, the neighborhood is safe and quiet, and the house is spacious and well-maintained.',
      isVerified: true,
      moveInDate: new Date('2023-12-01'),
      status: ReviewStatus.APPROVED,
    },
  });

  console.log('✅ Created reviews');

  // Create sample favorites
  await prisma.favorite.create({
    data: {
      userId: user1.id,
      propertyId: property3.id,
    },
  });

  await prisma.favorite.create({
    data: {
      userId: user2.id,
      propertyId: property1.id,
    },
  });

  console.log('✅ Created favorites');

  console.log('🎉 Database seeded successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
