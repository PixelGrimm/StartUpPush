# StartUpPush

A production-ready startup discovery platform built with Next.js 14, featuring project discovery, community voting, and promotion systems.

## 🚀 Features

- **Product Discovery Platform**: Submit, discover, and vote on innovative products
- **Community Voting System**: Upvote/downvote products with real-time updates
- **Points System**: Earn points for engagement and use them to rank higher
- **Dynamic Rankings**: Time-based product rankings (Today, Yesterday, Weekly, Monthly)
- **Promoted Products**: Highlighted sections for sponsored content
- **Dark/Light Theme**: Beautiful theme toggle with smooth transitions
- **Authentication**: Google OAuth and email-based authentication
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Blog Integration**: Built-in blog system with Markdown support
- **Stripe Integration**: Payment processing for product promotions (test mode)

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI**: React, TailwindCSS, shadcn/ui
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (Google + Email)
- **Payments**: Stripe (test mode)
- **Deployment**: Vercel-ready

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+ 
- npm or yarn
- PostgreSQL database
- Google OAuth credentials (optional)
- Stripe account (optional)

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd startuppush
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example environment file and configure your variables:

```bash
cp env.example .env.local
```

Update `.env.local` with your configuration:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/startuppush"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe (optional)
STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-publishable-key"
STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="whsec_your-stripe-webhook-secret"

# Email (for NextAuth email provider)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@yourdomain.com"
```

### 4. Set up the database

```bash
# Generate Prisma client
npm run db:generate

# Push the schema to your database
npm run db:push

# Seed the database with sample data
npm run db:seed
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
peerpush-clone/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── header.tsx        # Header component
│   ├── sidebar.tsx       # Sidebar component
│   ├── product-card.tsx  # Product card component
│   └── ...
├── lib/                  # Utility functions
│   ├── prisma.ts         # Prisma client
│   ├── store.ts          # Zustand store
│   └── utils.ts          # Utility functions
├── prisma/               # Database schema and migrations
│   ├── schema.prisma     # Prisma schema
│   └── seed.ts           # Database seed file
└── public/               # Static assets
```

## 🎯 Key Features Explained

### Product Rankings
The platform automatically ranks products based on:
- **Vote Score**: Upvotes minus downvotes
- **Time Periods**: Today, Yesterday, Weekly, Monthly
- **Promotion Status**: Promoted products get priority placement

### Points System
Users earn points for:
- Voting on products (+1 point per vote)
- Submitting products (+10 points)
- Receiving upvotes on their products (+5 points per upvote)

### Authentication
- **Google OAuth**: Quick sign-in with Google accounts
- **Email Authentication**: Magic link authentication
- **Session Management**: Secure session handling with NextAuth

### Responsive Design
- **Mobile-first**: Optimized for all screen sizes
- **Dark/Light Theme**: Smooth theme transitions
- **Accessibility**: WCAG compliant components

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**: Ensure your code is in a GitHub repository

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables in Vercel dashboard

3. **Set up Database**:
   - Use a PostgreSQL service (e.g., Supabase, PlanetScale, or Vercel Postgres)
   - Update `DATABASE_URL` in Vercel environment variables

4. **Deploy**:
   ```bash
   # Vercel will automatically deploy on push
   git push origin main
   ```

### Environment Variables for Production

Make sure to set these in your Vercel dashboard:

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-production-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio
```

### Database Management

```bash
# Reset database
npm run db:push --force-reset

# View database in Prisma Studio
npm run db:studio

# Generate new migration
npx prisma migrate dev --name migration_name
```

### Adding New Features

1. **New API Routes**: Add files in `app/api/`
2. **New Components**: Add files in `components/`
3. **Database Changes**: Update `prisma/schema.prisma`
4. **Styling**: Use TailwindCSS classes or add to `globals.css`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies for startup discovery
- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Join our community discussions

---

**Happy coding! 🚀**
