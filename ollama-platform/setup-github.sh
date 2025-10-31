#!/bin/bash

# Ollama Platform - GitHub Setup Script
# This script helps you push your Ollama Platform to GitHub

echo "🤖 Ollama Platform - GitHub Setup"
echo "================================="
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ This is not a Git repository. Please run this script from the project root."
    exit 1
fi

echo "📝 Please provide your GitHub repository information:"
echo ""

# Get GitHub username
read -p "GitHub Username: " github_username
if [ -z "$github_username" ]; then
    echo "❌ GitHub username is required."
    exit 1
fi

# Get repository name
read -p "Repository Name (default: ollama-platform-gui): " repo_name
if [ -z "$repo_name" ]; then
    repo_name="ollama-platform-gui"
fi

# Confirm the setup
echo ""
echo "📋 Setup Summary:"
echo "   GitHub Username: $github_username"
echo "   Repository Name: $repo_name"
echo "   Repository URL: https://github.com/$github_username/$repo_name"
echo ""

read -p "🤔 Continue with this setup? (y/N): " confirm
if [[ ! $confirm =~ ^[Yy]$ ]]; then
    echo "❌ Setup cancelled."
    exit 1
fi

echo ""
echo "🚀 Setting up GitHub repository..."

# Set the remote origin
git remote remove origin 2>/dev/null || true
git remote add origin "https://github.com/$github_username/$repo_name.git"

echo "✅ Remote origin set to: https://github.com/$github_username/$repo_name"

# Update README with correct repository links
echo "📝 Updating README with your repository information..."
sed -i.bak "s/your-username/$github_username/g" README.md
sed -i.bak "s/ollama-platform-gui/$repo_name/g" README.md
rm README.md.bak 2>/dev/null || true

# Add and commit the README update
git add README.md
git commit -m "Update README with repository information" 2>/dev/null || echo "ℹ️  No changes to commit for README update"

echo "✅ README updated with your repository information"

# Create .env.example if it doesn't exist
if [ ! -f ".env.example" ]; then
    echo "📄 Creating .env.example file..."
    cat > .env.example << EOF
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
EOF
    git add .env.example
    git commit -m "Add environment configuration example" 2>/dev/null || echo "ℹ️  No changes to commit for .env.example"
    echo "✅ .env.example created"
fi

# Push to GitHub
echo ""
echo "📤 Pushing to GitHub..."
echo "⚠️  You may be prompted for your GitHub credentials or token."
echo ""

# Try to push
if git push -u origin master; then
    echo ""
    echo "🎉 Successfully pushed to GitHub!"
    echo ""
    echo "📋 Next Steps:"
    echo "   1. Visit: https://github.com/$github_username/$repo_name"
    echo "   2. Set up GitHub Pages (optional) for easy deployment"
    echo "   3. Configure repository settings and description"
    echo "   4. Add collaborators if needed"
    echo ""
    echo "🌐 Your Ollama Platform is now on GitHub!"
    echo "   Repository: https://github.com/$github_username/$repo_name"
    echo "   Live Demo: https://60ze6hvx1i.space.minimax.io"
    echo ""
    echo "📖 For local development setup, see DEPLOYMENT.md"
else
    echo ""
    echo "❌ Failed to push to GitHub."
    echo ""
    echo "🔍 Possible solutions:"
    echo "   1. Create the repository on GitHub first:"
    echo "      → Visit: https://github.com/new"
    echo "      → Repository name: $repo_name"
    echo "      → Make it public"
    echo "      → Don't initialize with README (already exists)"
    echo ""
    echo "   2. Check your GitHub authentication:"
    echo "      → Use Personal Access Token instead of password"
    echo "      → Configure SSH keys for easier access"
    echo ""
    echo "   3. Try pushing manually:"
    echo "      → git push -u origin master"
    echo ""
fi

echo "✨ Setup script completed!"
