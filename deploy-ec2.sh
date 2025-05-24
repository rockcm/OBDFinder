#!/bin/bash

# EC2 Deployment Script for OBD Finder React Native Web App
# This script should be run on a fresh Amazon Linux 2 or Ubuntu EC2 instance

echo "🚀 Starting OBD Finder deployment on EC2..."

# Update system packages
echo "📦 Updating system packages..."
if [ -f /etc/amazon-linux-release ]; then
    # Amazon Linux 2
    sudo yum update -y
    sudo yum install -y docker git
elif [ -f /etc/lsb-release ]; then
    # Ubuntu
    sudo apt-get update
    sudo apt-get install -y docker.io docker-compose git
fi

# Start Docker service
echo "🐳 Starting Docker service..."
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker $USER

# Install Docker Compose (if not already installed)
if ! command -v docker-compose &> /dev/null; then
    echo "📦 Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Clone or update the repository
APP_DIR="/home/ec2-user/obd-finder"
if [ -d "$APP_DIR" ]; then
    echo "📁 Updating existing repository..."
    cd $APP_DIR
    git pull origin main
else
    echo "📁 Cloning repository..."
    git clone <YOUR_REPOSITORY_URL> $APP_DIR
    cd $APP_DIR
fi

# Create .env file for production
echo "⚙️ Creating production environment file..."
cat > .env << EOF
NODE_ENV=production
PORT=80
EOF

# Build and run the application
echo "🏗️ Building and starting the application..."
sudo docker-compose down || true
sudo docker-compose build --no-cache
sudo docker-compose up -d

# Configure firewall (if ufw is available)
if command -v ufw &> /dev/null; then
    echo "🔒 Configuring firewall..."
    sudo ufw allow 22    # SSH
    sudo ufw allow 80    # HTTP
    sudo ufw allow 443   # HTTPS (for future SSL)
    sudo ufw --force enable
fi

# Wait for the application to start
echo "⏳ Waiting for application to start..."
sleep 30

# Check if the application is running
if curl -f http://localhost:3000 >/dev/null 2>&1; then
    echo "✅ Application is running successfully!"
    echo "🌐 Access your app at: http://$(curl -s http://checkip.amazonaws.com):3000"
else
    echo "❌ Application failed to start. Check logs with: sudo docker-compose logs"
    exit 1
fi

echo "🎉 Deployment complete!"
echo ""
echo "Useful commands:"
echo "  View logs: sudo docker-compose logs -f"
echo "  Restart app: sudo docker-compose restart"
echo "  Stop app: sudo docker-compose down"
echo "  Update app: git pull && sudo docker-compose build --no-cache && sudo docker-compose up -d" 