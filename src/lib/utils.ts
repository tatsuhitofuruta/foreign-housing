import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, currency: string = 'JPY', locale: string = 'en'): string {
  return new Intl.NumberFormat(locale === 'ja' ? 'ja-JP' : 'en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatArea(area: number, locale: string = 'en'): string {
  return `${area.toFixed(2)} m²`;
}

export function formatDate(date: string, locale: string = 'en'): string {
  return new Date(date).toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getPropertyTypeLabel(type: string, locale: string = 'en'): string {
  const labels: Record<string, Record<string, string>> = {
    en: {
      apartment: 'Apartment',
      house: 'House',
      condo: 'Condo',
      studio: 'Studio',
    },
    ja: {
      apartment: 'アパート',
      house: '一戸建て',
      condo: 'マンション',
      studio: 'ワンルーム',
    },
  };
  return labels[locale]?.[type] || type;
}

export function calculateAverageRating(ratings: {
  overall: number;
  location: number;
  facilities: number;
  management: number;
  value: number;
}): number {
  const sum = ratings.overall + ratings.location + ratings.facilities + ratings.management + ratings.value;
  return sum / 5;
}

export function getYearsSince(year: number): number {
  return new Date().getFullYear() - year;
}
