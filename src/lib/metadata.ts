import { Metadata } from 'next';

interface GenerateMetadataParams {
  title: string;
  description: string;
  path: string;
  locale: string;
  images?: string[];
  type?: 'website' | 'article';
}

export function generateMetadata({
  title,
  description,
  path,
  locale,
  images = [],
  type = 'website',
}: GenerateMetadataParams): Metadata {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://foreign-housing.com';
  const url = `${baseUrl}/${locale}${path}`;

  const defaultImage = `${baseUrl}/og-image.png`;
  const ogImages = images.length > 0 ? images : [defaultImage];

  return {
    title: {
      default: title,
      template: '%s | Foreign Housing',
    },
    description,
    keywords: [
      'real estate',
      'Japan',
      'foreigner housing',
      'apartment rental',
      'property reviews',
      'Tokyo apartments',
      'housing for foreigners',
      '外国人向け不動産',
      '賃貸マンション',
    ],
    authors: [{ name: 'Foreign Housing Team' }],
    creator: 'Foreign Housing',
    publisher: 'Foreign Housing',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: url,
      languages: {
        en: `${baseUrl}/en${path}`,
        ja: `${baseUrl}/ja${path}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Foreign Housing',
      locale: locale === 'ja' ? 'ja_JP' : 'en_US',
      type,
      images: ogImages.map((image) => ({
        url: image,
        width: 1200,
        height: 630,
        alt: title,
      })),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImages,
      creator: '@foreignhousing',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
    manifest: '/manifest.json',
  };
}
