import { Property, Review } from '@prisma/client';

interface StructuredDataProps {
  type: 'property' | 'review' | 'organization';
  data: any;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  let structuredData = {};

  switch (type) {
    case 'property':
      structuredData = generatePropertySchema(data);
      break;
    case 'review':
      structuredData = generateReviewSchema(data);
      break;
    case 'organization':
      structuredData = generateOrganizationSchema();
      break;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

function generatePropertySchema(property: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Apartment',
    name: property.title,
    description: property.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.address,
      addressLocality: property.city,
      addressRegion: property.prefecture,
      postalCode: property.postalCode,
      addressCountry: 'JP',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: property.latitude,
      longitude: property.longitude,
    },
    numberOfRooms: property.bedrooms,
    floorSize: {
      '@type': 'QuantitativeValue',
      value: property.areaSqm,
      unitCode: 'MTK',
    },
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: property.currency,
      availability: 'https://schema.org/InStock',
    },
    ...(property.averageRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: property.averageRating,
        reviewCount: property.reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
    }),
    image: property.images[0],
  };
}

function generateReviewSchema(review: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'Apartment',
      name: review.property.title,
    },
    author: {
      '@type': 'Person',
      name: review.userName,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.ratingOverall,
      bestRating: 5,
      worstRating: 1,
    },
    reviewBody: review.comment,
    datePublished: review.createdAt,
  };
}

function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Foreign Housing',
    description: 'Real estate review platform for foreigners in Japan',
    url: 'https://foreign-housing.com',
    logo: 'https://foreign-housing.com/logo.png',
    sameAs: [
      // Add social media links when available
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'support@foreign-housing.com',
    },
  };
}
