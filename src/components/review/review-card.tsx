'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ThumbsUp } from 'lucide-react';
import { Review } from '@/types';
import { formatDate } from '@/lib/utils';
import Image from 'next/image';

interface ReviewCardProps {
  review: Review;
  onHelpful?: (reviewId: string) => void;
  isHelpful?: boolean;
}

export default function ReviewCard({
  review,
  onHelpful,
  isHelpful = false,
}: ReviewCardProps) {
  const locale = useLocale();
  const t = useTranslations();

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              {review.user_avatar ? (
                <Image
                  src={review.user_avatar}
                  alt={review.user_name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <span className="font-semibold text-primary">
                  {review.user_name[0]}
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{review.user_name}</span>
                {review.is_verified && (
                  <Badge variant="secondary" className="text-xs">
                    {t('review.verified')}
                  </Badge>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                {formatDate(review.created_at, locale)}
              </div>
            </div>
          </div>
          {renderStars(review.rating_overall)}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Title */}
        <h3 className="font-semibold text-lg">{review.title}</h3>

        {/* Comment */}
        <p className="text-sm leading-relaxed">{review.comment}</p>

        {/* Category Ratings */}
        <div className="grid grid-cols-2 gap-3 py-3 border-t">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">
              {t('review.location')}
            </span>
            {renderStars(review.rating_location)}
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">
              {t('review.facilities')}
            </span>
            {renderStars(review.rating_facilities)}
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">
              {t('review.management')}
            </span>
            {renderStars(review.rating_management)}
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">{t('review.value')}</span>
            {renderStars(review.rating_value)}
          </div>
        </div>

        {/* Images */}
        {review.images.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {review.images.map((image, index) => (
              <div
                key={index}
                className="relative w-24 h-24 rounded-md overflow-hidden"
              >
                <Image
                  src={image}
                  alt={`Review image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Helpful Button */}
        <div className="flex items-center gap-4 pt-3 border-t">
          <Button
            variant={isHelpful ? 'default' : 'outline'}
            size="sm"
            onClick={() => onHelpful?.(review.id)}
            className="gap-2"
          >
            <ThumbsUp className="h-4 w-4" />
            {t('review.helpful')} ({review.helpful_count})
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
