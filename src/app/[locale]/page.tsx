import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import Header from '@/components/layout/header';
import PropertyCard from '@/components/property/property-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Property } from '@/types';

// Mock data for demonstration
const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Apartment in Shibuya',
    title_ja: '渋谷のモダンアパート',
    description: 'Beautiful modern apartment with great access to Shibuya station',
    description_ja: '渋谷駅へのアクセスが良い美しいモダンアパート',
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
    images: ['/images/property-1.jpg'],
    amenities: ['Elevator', 'Balcony', 'Air Conditioning'],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    average_rating: 4.5,
    review_count: 12,
  },
  {
    id: '2',
    title: 'Cozy Studio near Shinjuku',
    title_ja: '新宿近くの居心地の良いワンルーム',
    description: 'Perfect for singles, close to shopping and dining',
    description_ja: 'シングルに最適、ショッピングや食事に便利',
    price: 120000,
    currency: 'JPY',
    property_type: 'studio',
    bedrooms: 1,
    bathrooms: 1,
    area_sqm: 28,
    year_built: 2018,
    address: '2-2-2 Shinjuku, Shinjuku-ku, Tokyo',
    latitude: 35.6938,
    longitude: 139.7034,
    prefecture: 'Tokyo',
    city: 'Shinjuku',
    ward: 'Shinjuku-ku',
    station_nearest: 'Shinjuku Station',
    station_walk_minutes: 8,
    images: ['/images/property-2.jpg'],
    amenities: ['Air Conditioning', 'Internet'],
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z',
    average_rating: 4.2,
    review_count: 8,
  },
  {
    id: '3',
    title: 'Spacious House in Setagaya',
    title_ja: '世田谷の広々とした一戸建て',
    description: 'Family-friendly house with garden',
    description_ja: '庭付きのファミリー向け一戸建て',
    price: 350000,
    currency: 'JPY',
    property_type: 'house',
    bedrooms: 4,
    bathrooms: 2,
    area_sqm: 120,
    year_built: 2015,
    address: '3-3-3 Setagaya, Setagaya-ku, Tokyo',
    latitude: 35.6464,
    longitude: 139.6533,
    prefecture: 'Tokyo',
    city: 'Setagaya',
    ward: 'Setagaya-ku',
    station_nearest: 'Sangen-jaya Station',
    station_walk_minutes: 12,
    images: ['/images/property-3.jpg'],
    amenities: ['Garden', 'Parking', 'Storage'],
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
    average_rating: 4.8,
    review_count: 15,
  },
];

export default function HomePage({
  params: { locale }
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const t = useTranslations();

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('home.title')}
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              {t('home.subtitle')}
            </p>

            {/* Search Bar */}
            <div className="flex gap-2 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder={t('home.searchPlaceholder')}
                  className="pl-10 h-12 text-foreground"
                />
              </div>
              <Button size="lg" className="h-12 px-8">
                {t('common.search')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">{t('home.featured')}</h2>
            <Button variant="outline">{t('nav.properties')} →</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Areas */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">{t('home.popular')}</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Shibuya', 'Shinjuku', 'Roppongi', 'Ginza'].map((area) => (
              <div
                key={area}
                className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="text-xl font-semibold">{area}</div>
                <div className="text-sm text-muted-foreground mt-2">
                  View properties
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 Foreign Housing. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
