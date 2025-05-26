#!/bin/bash

echo "🚀 Starting Ubuntu setup for Docker and Node.js development..."

# Update package index
echo "📦 Updating package index..."
sudo apt-get update

# Install prerequisites
echo "🔧 Installing prerequisites..."
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    git \
    wget \
    unzip

# Add Docker's official GPG key
echo "🔑 Adding Docker GPG key..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Set up the stable repository
echo "📝 Setting up Docker repository..."
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update the package index again
sudo apt-get update

# Install Docker Engine
echo "🐳 Installing Docker Engine..."
sudo apt-get install -y docker-ce docker-ce-cli containerd.io

# Start Docker service
echo "▶️ Starting Docker service..."
sudo systemctl start docker
sudo systemctl enable docker

# Add current user to docker group
echo "👤 Adding user to docker group..."
sudo usermod -aG docker $USER

# Install Docker Compose
echo "🔗 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Node.js (via NodeSource)
echo "📱 Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install useful development tools
echo "🛠️ Installing development tools..."
sudo apt-get install -y \
    htop \
    tree \
    vim \
    nano \
    jq

# Clean up
echo "🧹 Cleaning up..."
sudo apt-get autoremove -y
sudo apt-get autoclean

# Display versions
echo ""
echo "✅ Installation complete! Versions installed:"
echo "📋 System Info:"
echo "   OS: $(lsb_release -d | cut -f2)"
echo "   Architecture: $(dpkg --print-architecture)"
echo ""
echo "🐳 Docker: $(docker --version)"
echo "🔗 Docker Compose: $(docker-compose --version)"
echo "📱 Node.js: $(node --version)"
echo "📦 npm: $(npm --version)"
echo "🌿 Git: $(git --version)"
echo ""
echo "⚠️  IMPORTANT: Please log out and log back in (or run 'newgrp docker') for Docker permissions to take effect!"
echo ""
echo "🎉 Your Ubuntu system is now ready for Docker and Node.js development!" 