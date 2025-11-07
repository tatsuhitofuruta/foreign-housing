'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Bed, Bath, Square, Star } from 'lucide-react';
import { Property } from '@/types';
import { formatPrice, getPropertyTypeLabel } from '@/lib/utils';

interface PropertyCardProps {
  property: Property;
  isFavorite?: boolean;
  onFavoriteToggle?: (propertyId: string) => void;
}

export default function PropertyCard({
  property,
  isFavorite = false,
  onFavoriteToggle,
}: PropertyCardProps) {
  const locale = useLocale();
  const t = useTranslations();

  const title = locale === 'ja' ? property.title_ja : property.title;
  const imageUrl = property.images[0] || '/placeholder-property.jpg';

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/${locale}/properties/${property.id}`}>
        <div className="relative h-48 w-full">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-2 right-2">
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full"
              onClick={(e) => {
                e.preventDefault();
                onFavoriteToggle?.(property.id);
              }}
            >
              <Heart
                className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`}
              />
            </Button>
          </div>
          <div className="absolute top-2 left-2">
            <Badge>{getPropertyTypeLabel(property.property_type, locale)}</Badge>
          </div>
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/${locale}/properties/${property.id}`}>
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-lg line-clamp-1">{title}</h3>
              {property.average_rating && (
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">
                    {property.average_rating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="line-clamp-1">
                {property.station_nearest} • {property.city}
              </span>
            </div>

            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <Bed className="h-4 w-4 mr-1" />
                <span>{property.bedrooms}</span>
              </div>
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                <span>{property.bathrooms}</span>
              </div>
              <div className="flex items-center">
                <Square className="h-4 w-4 mr-1" />
                <span>{property.area_sqm}m²</span>
              </div>
            </div>
          </div>
        </Link>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="text-2xl font-bold text-primary">
          {formatPrice(property.price, property.currency, locale)}
        </div>
        {property.review_count && (
          <div className="text-sm text-muted-foreground">
            {property.review_count} {t('review.title').toLowerCase()}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
