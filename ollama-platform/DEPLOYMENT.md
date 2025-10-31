# Ollama Platform GUI - Deployment Guide

## 🚀 Live Demo
The platform is already deployed and live at: **https://60ze6hvx1i.space.minimax.io**

## 📋 Prerequisites

### System Requirements
- **Node.js** 18+ (recommended: 20+)
- **Git** (for version control)
- **pnpm** (preferred) or npm/yarn

### Required Accounts & Setup
1. **Supabase Account** (for backend services)
   - Create account at https://supabase.com
   - Create a new project
   - Note down your project URL and anon key

## 🏠 Local Development Setup

### Step 1: Clone the Repository
```bash
# Clone from your GitHub repository (replace with your repo URL)
git clone https://github.com/your-username/ollama-platform-gui.git
cd ollama-platform-gui

# Or if you have the local files
cd ollama-platform
```

### Step 2: Install Dependencies
```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install

# Or using yarn
yarn install
```

### Step 3: Environment Configuration
Create a `.env.local` file in the root directory:

```bash
# Copy the example environment file
cp .env.example .env.local
```

Add your Supabase credentials to `.env.local`:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 4: Database Setup
The application requires specific database tables. You can either:

1. **Use the provided SQL schema** (recommended):
   - Go to your Supabase dashboard → SQL Editor
   - Run the SQL scripts from `/database/schema.sql`

2. **Use the automatic setup** (if implemented):
   - The app will create tables on first run

### Step 5: Start Development Server
```bash
# Using pnpm
pnpm dev

# Using npm
npm run dev

# Using yarn
yarn dev
```

The application will be available at `http://localhost:5173`

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |
| `pnpm lint` | Run ESLint |
| `pnpm type-check` | Run TypeScript type checking |

## 📦 Production Build

### Build the Application
```bash
pnpm build
```

### Preview Production Build
```bash
pnpm preview
```

The built files will be in the `dist/` directory.

## 🌐 Deployment Options

### Option 1: Static Hosting (Netlify, Vercel, GitHub Pages)
1. Build the project: `pnpm build`
2. Deploy the `dist/` folder to your hosting service
3. Configure environment variables in your hosting service

### Option 2: VPS/Server Deployment
1. Build the project locally or on server
2. Use a web server (nginx, Apache) to serve the `dist/` folder
3. Configure SSL certificates for HTTPS

### Option 3: Docker Deployment
```bash
# Build Docker image
docker build -t ollama-platform .

# Run container
docker run -p 3000:80 -e VITE_SUPABASE_URL=your_url -e VITE_SUPABASE_ANON_KEY=your_key ollama-platform
```

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |

## 🗃️ Database Schema

The application uses the following main tables:
- `agents` - AI agent configurations
- `templates` - Pre-built agent templates
- `workflows` - Agent workflow definitions
- `monitoring_data` - Performance metrics
- `alerts` - System alerts and notifications
- `activity_logs` - User activity tracking
- `profiles` - User profile information

## 🐛 Troubleshooting

### Common Issues

1. **Supabase Connection Error**
   - Verify your Supabase URL and anon key
   - Check if your Supabase project is active
   - Ensure Row Level Security (RLS) policies are properly configured

2. **Build Errors**
   - Clear node_modules: `rm -rf node_modules && pnpm install`
   - Check Node.js version compatibility
   - Verify all dependencies are installed

3. **Development Server Issues**
   - Check if port 5173 is available
   - Try different port: `pnpm dev --port 3000`

### Getting Help
- Check the browser console for error messages
- Review the Supabase dashboard for database issues
- Ensure all environment variables are correctly set

## 🔄 Updates and Maintenance

### Updating Dependencies
```bash
# Check for outdated packages
pnpm outdated

# Update all packages
pnpm update

# Update specific package
pnpm update package-name
```

### Database Migrations
When database schema changes are needed:
1. Create migration files in `/database/migrations/`
2. Apply migrations through Supabase dashboard
3. Update TypeScript types if needed

## 📈 Performance Optimization

### Production Optimizations
- Enable compression in your web server
- Configure proper caching headers
- Use CDN for static assets
- Monitor bundle size with `pnpm build --analyze`

### Database Optimizations
- Add proper indexes for frequently queried fields
- Use Supabase's built-in caching
- Optimize queries for better performance

## 🔒 Security Considerations

### Frontend Security
- All sensitive operations require authentication
- Environment variables are properly configured
- No sensitive data exposed in client-side code

### Database Security
- Row Level Security (RLS) enabled on all tables
- Proper authentication required for all operations
- Regular security audits recommended

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)