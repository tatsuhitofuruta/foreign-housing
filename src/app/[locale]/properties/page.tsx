import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import Header from '@/components/layout/header';
import PropertyCard from '@/components/property/property-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Property } from '@/types';

// Mock data (same as home page for now)
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
  // Add more mock properties as needed
];

export default function PropertiesPage({
  params: { locale }
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const t = useTranslations();

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">{t('search.filters')}</h2>
            </div>

            {/* Property Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t('search.propertyType')}
              </label>
              <div className="space-y-2">
                {['apartment', 'house', 'condo', 'studio'].map((type) => (
                  <label key={type} className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">
                      {t(`property.types.${type}`)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t('search.priceRange')}
              </label>
              <div className="flex gap-2">
                <Input type="number" placeholder="Min" />
                <Input type="number" placeholder="Max" />
              </div>
            </div>

            {/* Bedrooms */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t('search.bedrooms')}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((num) => (
                  <Button key={num} variant="outline" size="sm">
                    {num}+
                  </Button>
                ))}
              </div>
            </div>

            {/* Apply Filters */}
            <div className="space-y-2">
              <Button className="w-full">{t('common.apply')}</Button>
              <Button variant="outline" className="w-full">
                {t('common.reset')}
              </Button>
            </div>
          </aside>

          {/* Properties Grid */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {t('search.title')}
                </h1>
                <p className="text-muted-foreground">
                  {mockProperties.length} properties found
                </p>
              </div>

              <div className="w-48">
                <label className="text-sm font-medium block mb-2">
                  {t('search.sortBy')}
                </label>
                <select className="w-full border rounded-md px-3 py-2">
                  <option>{t('search.sortOptions.priceAsc')}</option>
                  <option>{t('search.sortOptions.priceDesc')}</option>
                  <option>{t('search.sortOptions.newest')}</option>
                  <option>{t('search.sortOptions.rating')}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center gap-2">
              <Button variant="outline">Previous</Button>
              <Button variant="outline">1</Button>
              <Button>2</Button>
              <Button variant="outline">3</Button>
              <Button variant="outline">Next</Button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
