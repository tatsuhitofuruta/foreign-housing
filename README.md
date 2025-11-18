# Foreign Housing - Real Estate Review Platform

A modern real estate review platform designed for foreigners living in or moving to Japan. Browse properties with reviews from actual residents.

## 🌟 Features

- **Property Listings**: Browse apartments, houses, condos, and studios
- **User Reviews**: Read detailed reviews from verified residents
- **Multi-language Support**: English and Japanese interface
- **Advanced Search**: Filter by location, price, property type, and more
- **Photo Galleries**: View property images uploaded by owners and residents
- **Rating System**: 5-category rating (location, facilities, management, value)
- **Favorites**: Save properties for later viewing
- **Responsive Design**: Works seamlessly on desktop and mobile

## 🚀 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **next-intl** - Internationalization
- **Lucide React** - Icon library

### Backend
- **Prisma** - Type-safe ORM for PostgreSQL
- **NextAuth.js** - Authentication
- **Next.js API Routes** - Server-side API
- **PostgreSQL** - Primary database (AWS RDS)

### Infrastructure
- **Terraform** - Infrastructure as Code
- **AWS RDS** - PostgreSQL database with automated backups
- **AWS S3** - Image storage
- **AWS CloudFront** - CDN for image delivery
- **AWS Cognito** - Optional user authentication
- **AWS SES** - Transactional emails

## 📁 Project Structure

```
foreign-housing/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── page.tsx              # Home page
│   │   │   ├── properties/
│   │   │   │   ├── page.tsx          # Property listings
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx      # Property details
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                       # UI components (Button, Card, etc.)
│   │   ├── layout/                   # Layout components (Header, Footer)
│   │   ├── property/                 # Property-related components
│   │   └── review/                   # Review components
│   ├── lib/
│   │   └── utils.ts                  # Utility functions
│   ├── types/
│   │   └── index.ts                  # TypeScript type definitions
│   ├── messages/                     # i18n translation files
│   │   ├── en.json
│   │   └── ja.json
│   └── i18n.ts
├── public/
├── DESIGN.md                         # Design documentation
└── README.md
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/foreign-housing.git
cd foreign-housing
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Set up the database:
```bash
# Start PostgreSQL (via Docker or local installation)
# Then run migrations
npm run db:generate
npm run db:push
npm run db:seed
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:migrate:dev` - Create and run migrations in development
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run db:seed` - Seed database with sample data

## 🌐 Internationalization

The app supports multiple languages:
- English (default) - `/en`
- Japanese - `/ja`

Language can be switched using the language toggle in the header.

## 📱 Pages

### Home Page (`/[locale]`)
- Hero section with search bar
- Featured properties
- Popular areas

### Property Listings (`/[locale]/properties`)
- Grid view of properties
- Filter sidebar (type, price, bedrooms)
- Sort options
- Pagination

### Property Detail (`/[locale]/properties/[id]`)
- Image gallery
- Property details (bedrooms, bathrooms, area, etc.)
- Amenities list
- Location information
- User reviews with ratings
- Contact/inquiry form

## 🎨 Design Philosophy

The design is inspired by:
- **Zillow** (US) - Clean, modern interface
- **Rightmove** (UK) - User-friendly navigation
- **マンションノート** (Japan) - Local market insights

Key design principles:
- **Mobile-first**: Responsive design for all devices
- **Intuitive**: Clear navigation and search functionality
- **Trustworthy**: Verified reviews and transparent information
- **Accessible**: Multi-language support for international users

## 🔜 Roadmap

### Phase 1 (Current)
- ✅ Project setup
- ✅ Core pages (Home, Listings, Details)
- ✅ Multi-language support
- ✅ Review display

### Phase 2
- [ ] User authentication (Supabase Auth)
- [ ] Database integration
- [ ] Review submission form
- [ ] Photo upload functionality

### Phase 3
- [ ] Map integration (Google Maps/Mapbox)
- [ ] Favorites/Saved properties
- [ ] User profiles
- [ ] Email notifications

### Phase 4
- [ ] Advanced search filters
- [ ] Property comparison
- [ ] Admin dashboard
- [ ] Analytics

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

Built with ❤️ for the international community in Japan
