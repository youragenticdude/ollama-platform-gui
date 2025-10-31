# 🤖 Ollama Platform GUI

<div align="center">

![Ollama Platform](https://img.shields.io/badge/Ollama-Platform-blue?style=for-the-badge&logo=robot)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase)

**A futuristic AI agent management platform with real-time monitoring, workflow builders, and comprehensive agent lifecycle management.**

[🚀 Live Demo](https://60ze6hvx1i.space.minimax.io) • [📖 Documentation](./DEPLOYMENT.md) • [🐛 Report Bug](https://github.com/your-username/ollama-platform-gui/issues)

</div>

## ✨ Features

### 🎯 **Core Platform Capabilities**
- **🧙‍♂️ 4-Step Agent Creation Wizard** - Intuitive agent setup with template selection, configuration, workflow building, and deployment
- **📊 Real-Time Monitoring Dashboard** - Live performance metrics, status tracking, and interactive charts
- **📚 Template Gallery** - 15+ pre-built templates across 6 categories (Business, Social Media, Productivity, Healthcare, Education, Finance)
- **⚙️ Agent Management** - Complete lifecycle management with start/stop/pause/delete operations
- **🎨 Futuristic UI/UX** - Clean, modern interface with deep blues, electric accents, and smooth animations

### 🏗️ **Technical Features**
- **⚡ Real-Time Updates** - WebSocket-powered live data streaming
- **📱 Responsive Design** - Works seamlessly across desktop, tablet, and mobile
- **🔐 Secure Authentication** - Supabase Auth integration with user management
- **🗄️ Full-Stack Backend** - Complete database schema with edge functions
- **🎪 Interactive Workflows** - Drag-and-drop workflow builder (planned)
- **📈 Performance Analytics** - Comprehensive metrics and reporting

## 🚀 Quick Start

### 🎮 Try the Live Demo
Experience the platform immediately at: **[https://60ze6hvx1i.space.minimax.io](https://60ze6hvx1i.space.minimax.io)**

### 💻 Local Development

```bash
# 1. Clone the repository
git clone https://github.com/your-username/ollama-platform-gui.git
cd ollama-platform-gui

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env.local
# Add your Supabase credentials to .env.local

# 4. Start development server
pnpm dev
```

Visit `http://localhost:5173` to see the platform running locally.

## 🛠️ Tech Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Frontend** | React 18.3 + TypeScript | Component-based UI with type safety |
| **Styling** | Tailwind CSS + shadcn/ui | Utility-first CSS with beautiful components |
| **Backend** | Supabase | Database, authentication, real-time features |
| **Build Tool** | Vite | Fast development and optimized builds |
| **Charts** | Recharts | Interactive data visualization |
| **State Management** | React Context + Hooks | Lightweight state management |

## 📁 Project Structure

```
ollama-platform/
├── src/
│   ├── components/          # React components
│   │   ├── agents/         # Agent management components
│   │   ├── auth/           # Authentication components
│   │   ├── dashboard/      # Dashboard components
│   │   ├── layout/         # Layout components
│   │   ├── monitoring/     # Monitoring components
│   │   ├── templates/      # Template components
│   │   └── ui/             # Reusable UI components
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Utility libraries
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets
├── database/               # Database schema and migrations
└── docs/                   # Documentation
```

## 🎨 Design System

### Color Palette
- **Primary**: Deep Blues (#1e40af, #3b82f6)
- **Secondary**: Soft Grays (#6b7280, #9ca3af)
- **Accents**: Electric Blue (#06b6d4), Neon Green (#10b981)
- **Status**: Success (#22c55e), Warning (#f59e0b), Error (#ef4444)

### Typography
- **Primary Font**: Inter (headings, UI text)
- **Code Font**: JetBrains Mono (code blocks, technical content)

## 📊 Database Schema

The platform uses 7 main tables:

| Table | Purpose |
|-------|---------|
| `agents` | AI agent configurations and metadata |
| `templates` | Pre-built agent templates |
| `workflows` | Agent workflow definitions |
| `monitoring_data` | Performance metrics and analytics |
| `alerts` | System alerts and notifications |
| `activity_logs` | User activity and audit trail |
| `profiles` | Extended user profile information |

## 🚀 Deployment

### Production Deployment
The platform is production-ready and can be deployed to:
- **Vercel/Netlify** (Static hosting)
- **VPS/Cloud** (Self-hosted)
- **Docker** (Containerized deployment)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🧪 Testing

```bash
# Run type checking
pnpm type-check

# Run linting
pnpm lint

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **MiniMax Team** - Platform development and design
- **Supabase** - Backend infrastructure and real-time features
- **shadcn/ui** - Beautiful and accessible UI components
- **Recharts** - Powerful charting library

## 📞 Support

- **Documentation**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Issues**: [GitHub Issues](https://github.com/your-username/ollama-platform-gui/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/ollama-platform-gui/discussions)

---

<div align="center">

**Built with ❤️ by the MiniMax Team**

[⬆ Back to top](#-ollama-platform-gui)

</div>
