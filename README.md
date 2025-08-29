# Altroway - Job Platform

A modern, full-stack job platform built with Next.js, Supabase, and TypeScript. Connect job seekers with employers through an intuitive interface with real-time messaging, profile management, and comprehensive job application tracking.

## 🚀 Features

### Core Functionality
- **Job Listings**: Browse and search for job opportunities
- **Job Applications**: Apply to jobs with cover letters and resume uploads
- **Real-time Messaging**: Instant communication between employers and applicants
- **Profile Management**: Comprehensive user profiles with bio, skills, and experience
- **Dashboard**: Personalized dashboards for different user roles
- **Admin Panel**: Super admin controls for platform management

### Advanced Messaging System
- **Real-time Updates**: Instant message delivery with Supabase real-time subscriptions
- **Profile Integration**: View participant profiles directly from conversations
- **Job Linking**: Quick access to job details and application status
- **Message Status**: Visual indicators for sending, sent, delivered, and read status
- **Polling Fallback**: 3-second polling as backup for real-time connections
- **Optimistic UI**: Messages appear immediately while being sent
- **Auto-scroll**: Automatic scrolling to latest messages
- **Read Receipts**: Visual confirmation when messages are read

### User Roles & Permissions
- **Job Seekers**: Apply to jobs, manage applications, communicate with employers
- **Employers**: Post jobs, review applications, communicate with applicants
- **Super Admins**: Full platform access, user management, analytics

### Security Features
- **Role-Based Access Control (RBAC)**: Secure access based on user roles
- **Row Level Security (RLS)**: Database-level security policies
- **Authentication**: Secure user authentication with Supabase Auth
- **Authorization**: Server-side validation for all operations

## 🛠️ Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: Modern UI components
- **Lucide React**: Beautiful icons

### Backend
- **Supabase**: Backend-as-a-Service
  - PostgreSQL Database
  - Real-time subscriptions
  - Row Level Security (RLS)
  - Authentication
  - Storage

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Static type checking

## 📁 Project Structure

```
altroway/
├── app/                          # Next.js App Router
│   ├── actions/                  # Server Actions
│   ├── api/                      # API Routes
│   ├── auth/                     # Authentication pages
│   ├── dashboard/                # Dashboard components
│   ├── jobs/                     # Job-related pages
│   ├── messages/                 # Messaging system
│   ├── profile/                  # Profile management
│   └── globals.css              # Global styles
├── components/                   # Reusable UI components
│   ├── ui/                      # Shadcn/ui components
│   ├── header.tsx              # Main header
│   ├── footer.tsx              # Footer component
│   └── message-notification.tsx # Message notifications
├── lib/                         # Utility libraries
│   ├── supabase/               # Supabase client configuration
│   └── utils.ts                # Utility functions
├── hooks/                       # Custom React hooks
├── public/                      # Static assets
├── supabase/                    # Database migrations
└── scripts/                     # Setup and utility scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd altroway
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Set up the database**
   ```bash
   # Run database migrations
   npx supabase db push
   
   # Or run the setup script
   npm run setup
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

### Core Tables
- **profiles**: User profile information
- **jobs**: Job listings posted by employers
- **job_applications**: Applications submitted by job seekers
- **conversations**: Messaging conversations between users
- **messages**: Individual messages within conversations
- **site_settings**: Platform configuration

### Key Relationships
- Users can have multiple job applications
- Employers can post multiple jobs
- Conversations are linked to job applications
- Messages belong to conversations

## 🔐 Authentication & Authorization

### User Roles
1. **job_seeker**: Can apply to jobs and communicate with employers
2. **employer**: Can post jobs and communicate with applicants
3. **super_admin**: Full platform access

### Security Policies
- Row Level Security (RLS) on all tables
- Role-based access control
- Server-side authorization checks
- Secure API endpoints

## 💬 Messaging System

### Features
- **Real-time messaging** with Supabase subscriptions
- **Profile integration** - view participant details
- **Job linking** - quick access to job information
- **Message status indicators** - track delivery and read status
- **Polling fallback** - ensures reliability
- **Optimistic UI** - immediate message display

### Usage
1. **Start a conversation** from job applications
2. **Send messages** with real-time delivery
3. **View participant profiles** with detailed information
4. **Access job details** directly from conversations
5. **Track message status** with visual indicators

## 🎨 UI Components

### Design System
- **Shadcn/ui**: Modern, accessible components
- **Tailwind CSS**: Utility-first styling
- **Responsive design**: Works on all devices
- **Dark mode support**: Theme switching capability

### Key Components
- **Cards**: Information display
- **Buttons**: Interactive elements
- **Forms**: Data input and validation
- **Modals**: Overlay dialogs
- **Navigation**: Menu and routing

## 📱 Responsive Design

The platform is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
npm run setup        # Initial setup script
```

### Code Style
- **TypeScript**: Strict type checking
- **ESLint**: Code linting and formatting
- **Prettier**: Consistent code formatting
- **Conventional commits**: Standardized commit messages

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Similar to Vercel deployment
- **Railway**: Full-stack deployment
- **DigitalOcean**: Custom server deployment

## 📊 Analytics & Monitoring

### Built-in Analytics
- User registration and activity tracking
- Job application statistics
- Messaging engagement metrics
- Platform usage analytics

### Monitoring
- Error tracking and logging
- Performance monitoring
- User feedback collection
- System health checks

## 🔒 Security

### Data Protection
- **Encryption**: All data encrypted in transit and at rest
- **Authentication**: Secure user authentication
- **Authorization**: Role-based access control
- **Input Validation**: Sanitized user inputs
- **XSS Protection**: Content security policies

### Privacy
- **GDPR Compliance**: User data protection
- **Data Retention**: Configurable data retention policies
- **User Consent**: Transparent data usage
- **Data Export**: User data export capabilities

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Standards
- Follow TypeScript best practices
- Write meaningful commit messages
- Add comments for complex logic
- Maintain consistent code style
- Test your changes thoroughly

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [API Documentation](./docs/api.md)
- [Database Schema](./docs/schema.md)
- [Deployment Guide](./docs/deployment.md)

### Getting Help
- **Issues**: Report bugs and feature requests
- **Discussions**: Ask questions and share ideas
- **Wiki**: Detailed documentation and guides

### Community
- **Discord**: Join our community server
- **GitHub**: Star and watch the repository
- **Twitter**: Follow for updates

## 🎯 Roadmap

### Upcoming Features
- [ ] Video calling integration
- [ ] Advanced job search filters
- [ ] Resume builder
- [ ] Interview scheduling
- [ ] Email notifications
- [ ] Mobile app
- [ ] AI-powered job matching
- [ ] Advanced analytics dashboard

### Performance Improvements
- [ ] Image optimization
- [ ] Code splitting
- [ ] Caching strategies
- [ ] Database query optimization
- [ ] CDN integration

## 🙏 Acknowledgments

- **Supabase** for the excellent backend platform
- **Vercel** for seamless deployment
- **Shadcn/ui** for beautiful components
- **Next.js** team for the amazing framework
- **Tailwind CSS** for the utility-first approach

---

**Built with ❤️ by the Altroway Team**
