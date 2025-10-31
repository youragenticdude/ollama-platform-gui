#!/bin/bash

# Ollama Platform - Local Development Setup Script
# This script helps you set up the Ollama Platform for local development

echo "🏠 Ollama Platform - Local Development Setup"
echo "============================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$node_version" -lt 18 ]; then
    echo "❌ Node.js version is too old. Please install Node.js 18+ (current: v$(node -v))"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if pnpm is installed, if not suggest installation
if command -v pnpm &> /dev/null; then
    echo "✅ pnpm $(pnpm -v) detected"
    PACKAGE_MANAGER="pnpm"
elif command -v yarn &> /dev/null; then
    echo "✅ yarn $(yarn -v) detected"
    PACKAGE_MANAGER="yarn"
elif command -v npm &> /dev/null; then
    echo "✅ npm $(npm -v) detected"
    PACKAGE_MANAGER="npm"
else
    echo "❌ No package manager found. Please install npm, yarn, or pnpm."
    exit 1
fi

echo ""
echo "📦 Installing dependencies..."
case $PACKAGE_MANAGER in
    "pnpm")
        pnpm install
        ;;
    "yarn")
        yarn install
        ;;
    "npm")
        npm install
        ;;
esac

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies."
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Set up environment file
echo ""
echo "🔧 Setting up environment configuration..."

if [ ! -f ".env.local" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        echo "✅ Created .env.local from .env.example"
    else
        cat > .env.local << EOF
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
EOF
        echo "✅ Created .env.local with default values"
    fi
else
    echo "ℹ️  .env.local already exists"
fi

echo ""
echo "🔑 Supabase Configuration Required"
echo "=================================="
echo ""
echo "To complete the setup, you need to:"
echo "1. Create a Supabase account at https://supabase.com"
echo "2. Create a new project"
echo "3. Get your project URL and anon key from Settings → API"
echo "4. Update .env.local with your credentials:"
echo ""
echo "   VITE_SUPABASE_URL=https://your-project.supabase.co"
echo "   VITE_SUPABASE_ANON_KEY=your-anon-key"
echo ""

read -p "🤔 Do you want to update .env.local now? (y/N): " update_env
if [[ $update_env =~ ^[Yy]$ ]]; then
    echo ""
    read -p "Supabase URL: " supabase_url
    read -p "Supabase Anon Key: " supabase_key
    
    if [ ! -z "$supabase_url" ] && [ ! -z "$supabase_key" ]; then
        cat > .env.local << EOF
# Supabase Configuration
VITE_SUPABASE_URL=$supabase_url
VITE_SUPABASE_ANON_KEY=$supabase_key
EOF
        echo "✅ Environment file updated successfully"
    else
        echo "⚠️  Skipped environment update (empty values provided)"
    fi
fi

echo ""
echo "🚀 Setup Complete!"
echo "=================="
echo ""
echo "📋 Available Commands:"
case $PACKAGE_MANAGER in
    "pnpm")
        echo "   $PACKAGE_MANAGER dev       # Start development server"
        echo "   $PACKAGE_MANAGER build     # Build for production"
        echo "   $PACKAGE_MANAGER preview   # Preview production build"
        echo "   $PACKAGE_MANAGER lint      # Run linting"
        ;;
    "yarn")
        echo "   $PACKAGE_MANAGER dev       # Start development server"
        echo "   $PACKAGE_MANAGER build     # Build for production"
        echo "   $PACKAGE_MANAGER preview   # Preview production build"
        echo "   $PACKAGE_MANAGER lint      # Run linting"
        ;;
    "npm")
        echo "   $PACKAGE_MANAGER run dev      # Start development server"
        echo "   $PACKAGE_MANAGER run build    # Build for production"
        echo "   $PACKAGE_MANAGER run preview  # Preview production build"
        echo "   $PACKAGE_MANAGER run lint     # Run linting"
        ;;
esac

echo ""
echo "🌟 Next Steps:"
echo "   1. Update .env.local with your Supabase credentials (if not done)"
case $PACKAGE_MANAGER in
    "pnpm"|"yarn")
        echo "   2. Run: $PACKAGE_MANAGER dev"
        ;;
    "npm")
        echo "   2. Run: $PACKAGE_MANAGER run dev"
        ;;
esac
echo "   3. Open: http://localhost:5173"
echo ""
echo "🌐 Live Demo: https://60ze6hvx1i.space.minimax.io"
echo "📖 Documentation: ./DEPLOYMENT.md"
echo ""
echo "✨ Happy coding!"
