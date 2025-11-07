import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import Header from '@/components/layout/header';
import ReviewCard from '@/components/review/review-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Calendar,
  Train,
  Heart,
  Share2,
  Star,
} from 'lucide-react';
import { Property, Review } from '@/types';
import { formatPrice, getPropertyTypeLabel, getYearsSince } from '@/lib/utils';
import Image from 'next/image';

// Mock property data
const mockProperty: Property = {
  id: '1',
  title: 'Modern Apartment in Shibuya',
  title_ja: '渋谷のモダンアパート',
  description:
    'Beautiful modern apartment with great access to Shibuya station. This property features high ceilings, large windows with natural light, and modern appliances. Perfect for professionals or small families.',
  description_ja:
    '渋谷駅へのアクセスが良い美しいモダンアパート。高い天井、自然光の入る大きな窓、最新の設備が特徴です。プロフェッショナルや小家族に最適です。',
  price: 180000,
  currency: 'JPY',
  property_type: 'apartment',
  bedrooms: 2,
  bathrooms: 1,
  area_sqm: 55,
  year_built: 2020,
  address: '1-1-1 Shibuya, Shibuya-ku, Tokyo',
  latitude: 35.6595,
  longitude: 139.7004,
  prefecture: 'Tokyo',
  city: 'Shibuya',
  ward: 'Shibuya-ku',
  station_nearest: 'Shibuya Station',
  station_walk_minutes: 5,
  images: [
    '/images/property-1.jpg',
    '/images/property-2.jpg',
    '/images/property-3.jpg',
  ],
  amenities: [
    'Elevator',
    'Balcony',
    'Air Conditioning',
    'Heating',
    'Storage',
    'Internet',
  ],
  created_at: '2024-01-15T00:00:00Z',
  updated_at: '2024-01-15T00:00:00Z',
  average_rating: 4.5,
  review_count: 12,
};

// Mock reviews
const mockReviews: Review[] = [
  {
    id: '1',
    property_id: '1',
    user_id: 'user1',
    user_name: 'John Smith',
    rating_overall: 5,
    rating_location: 5,
    rating_facilities: 5,
    rating_management: 4,
    rating_value: 4,
    title: 'Perfect location and great amenities',
    comment:
      'I have been living here for 6 months and absolutely love it. The location is unbeatable - just 5 minutes from Shibuya station. The apartment is clean, modern, and well-maintained.',
    images: [],
    helpful_count: 8,
    is_verified: true,
    created_at: '2024-03-15T00:00:00Z',
    updated_at: '2024-03-15T00:00:00Z',
  },
  {
    id: '2',
    property_id: '1',
    user_id: 'user2',
    user_name: 'Sarah Johnson',
    rating_overall: 4,
    rating_location: 5,
    rating_facilities: 4,
    rating_management: 4,
    rating_value: 3,
    title: 'Great apartment but a bit pricey',
    comment:
      'The apartment is very nice and the location is excellent. However, I think the rent is a bit high for the size. Overall still satisfied with my choice.',
    images: [],
    helpful_count: 5,
    is_verified: true,
    created_at: '2024-02-20T00:00:00Z',
    updated_at: '2024-02-20T00:00:00Z',
  },
];

export default function PropertyDetailPage({
  params: { locale, id },
}: {
  params: { locale: string; id: string };
}) {
  unstable_setRequestLocale(locale);
  const t = useTranslations();

  const title = locale === 'ja' ? mockProperty.title_ja : mockProperty.title;
  const description =
    locale === 'ja' ? mockProperty.description_ja : mockProperty.description;

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{title}</h1>
              <div className="flex items-center text-muted-foreground gap-4">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {mockProperty.address}
                </div>
                {mockProperty.average_rating && (
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">
                      {mockProperty.average_rating.toFixed(1)}
                    </span>
                    <span className="ml-1">
                      ({mockProperty.review_count} reviews)
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Badge>{getPropertyTypeLabel(mockProperty.property_type, locale)}</Badge>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-2 gap-2 mb-8 h-96">
          <div className="relative col-span-1 row-span-2">
            <Image
              src={mockProperty.images[0] || '/placeholder.jpg'}
              alt={title}
              fill
              className="object-cover rounded-l-lg"
            />
          </div>
          {mockProperty.images.slice(1, 3).map((image, index) => (
            <div key={index} className="relative">
              <Image
                src={image}
                alt={`${title} ${index + 2}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Details */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Property Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Bed className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {t('property.bedrooms')}
                    </div>
                    <div className="font-semibold">{mockProperty.bedrooms}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Bath className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {t('property.bathrooms')}
                    </div>
                    <div className="font-semibold">{mockProperty.bathrooms}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Square className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {t('property.area')}
                    </div>
                    <div className="font-semibold">{mockProperty.area_sqm}m²</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {t('property.yearBuilt')}
                    </div>
                    <div className="font-semibold">
                      {getYearsSince(mockProperty.year_built)} years
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Description */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Description</h2>
              <p className="text-muted-foreground leading-relaxed">
                {description}
              </p>
            </section>

            {/* Amenities */}
            <section>
              <h2 className="text-2xl font-bold mb-4">
                {t('property.amenities')}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {mockProperty.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center space-x-2 text-sm"
                  >
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Location */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Location</h2>
              <div className="bg-muted/50 rounded-lg p-6 space-y-3">
                <div className="flex items-center space-x-2">
                  <Train className="h-5 w-5 text-muted-foreground" />
                  <span>
                    <strong>{mockProperty.station_nearest}</strong> -{' '}
                    {mockProperty.station_walk_minutes} {t('property.walkMinutes')}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <span>{mockProperty.address}</span>
                </div>
              </div>
            </section>

            {/* Reviews */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  {t('review.title')} ({mockReviews.length})
                </h2>
                <Button>{t('review.writeReview')}</Button>
              </div>

              <div className="space-y-4">
                {mockReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              {/* Price Card */}
              <div className="border rounded-lg p-6 space-y-4">
                <div>
                  <div className="text-3xl font-bold text-primary">
                    {formatPrice(mockProperty.price, mockProperty.currency, locale)}
                  </div>
                  <div className="text-sm text-muted-foreground">per month</div>
                </div>

                <Button className="w-full" size="lg">
                  Contact Owner
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  Schedule Viewing
                </Button>
              </div>

              {/* Safety Tips */}
              <div className="border rounded-lg p-6">
                <h3 className="font-semibold mb-3">Safety Tips</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Meet in person before making payments</li>
                  <li>• Verify property ownership</li>
                  <li>• Read contract carefully</li>
                  <li>• Report suspicious activity</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
