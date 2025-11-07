'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Home, Search, Heart, User } from 'lucide-react';

export default function Header() {
  const t = useTranslations();
  const locale = useLocale();

  const toggleLocale = () => {
    const newLocale = locale === 'en' ? 'ja' : 'en';
    window.location.href = `/${newLocale}`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href={`/${locale}`} className="mr-6 flex items-center space-x-2">
            <Home className="h-6 w-6" />
            <span className="font-bold text-xl">Foreign Housing</span>
          </Link>
        </div>

        <nav className="flex flex-1 items-center space-x-6 text-sm font-medium">
          <Link
            href={`/${locale}/properties`}
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            {t('nav.properties')}
          </Link>
          <Link
            href={`/${locale}/search`}
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            {t('nav.search')}
          </Link>
        </nav>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLocale}
            aria-label="Toggle language"
          >
            <span className="text-sm font-medium">
              {locale === 'en' ? 'JA' : 'EN'}
            </span>
          </Button>

          <Link href={`/${locale}/favorites`}>
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
          </Link>

          <Link href={`/${locale}/profile`}>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
