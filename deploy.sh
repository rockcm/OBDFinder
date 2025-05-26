#!/bin/bash

# OBDFinder Deployment Script for EC2
# This script automates the deployment of the OBDFinder app to EC2

echo "===== Starting OBDFinder Deployment ====="

# Update system packages
echo "Updating system packages..."
sudo yum update -y || sudo apt update -y

# Install Node.js if not installed
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    # Try Amazon Linux method
    curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash - && sudo yum install -y nodejs || \
    # If that fails, try Ubuntu method
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt install -y nodejs
    
    if ! command -v node &> /dev/null; then
        echo "Failed to install Node.js. Exiting..."
        exit 1
    fi
fi

# Install required global npm packages
echo "Installing required npm packages..."
sudo npm install -g expo-cli pm2 serve

# Pull latest changes if this is a re-deployment
if [ -d "OBDFinder" ]; then
    echo "Repository already exists, pulling latest changes..."
    cd OBDFinder
    git pull
    cd ..
else
    # Clone repository - replace with your actual repository URL
    echo "Cloning repository..."
    git clone [YOUR_REPOSITORY_URL] OBDFinder
fi

# Navigate to project directory
cd OBDFinder

# Install project dependencies
echo "Installing project dependencies..."
npm install

# Check if .env file exists, create if not
if [ ! -f .env ]; then
    echo "Creating .env file..."
    echo "YOUTUBE_API_KEY=your_youtube_api_key" > .env
    echo "Please update the .env file with your actual API keys"
fi

# Build the web version
echo "Building web version..."
npx expo export:web

# Start or restart the application with PM2
if pm2 list | grep -q "OBDFinder"; then
    echo "Restarting application with PM2..."
    pm2 restart OBDFinder
else
    echo "Starting application with PM2..."
    pm2 start "serve web-build -p 19006" --name "OBDFinder"
fi

# Save PM2 process list
pm2 save

# Set up PM2 to start on boot if not already done
echo "Setting up PM2 to start on boot..."
pm2 startup | tail -n 1 > startup_command.txt
chmod +x startup_command.txt
./startup_command.txt
rm startup_command.txt

# Check if Nginx is installed, install if not
if ! command -v nginx &> /dev/null; then
    echo "Installing Nginx..."
    sudo yum install -y nginx || sudo apt install -y nginx
fi

# Create Nginx configuration
echo "Configuring Nginx..."
NGINX_CONF_DIR=""
if [ -d "/etc/nginx/conf.d" ]; then
    NGINX_CONF_DIR="/etc/nginx/conf.d"
    NGINX_CONF_FILE="$NGINX_CONF_DIR/obdfinder.conf"
elif [ -d "/etc/nginx/sites-available" ]; then
    NGINX_CONF_DIR="/etc/nginx/sites-available"
    NGINX_CONF_FILE="$NGINX_CONF_DIR/obdfinder"
else
    echo "Could not determine Nginx configuration directory. Please configure manually."
    exit 1
fi

# Create Nginx config file
cat > temp_nginx_conf << 'EOF'
server {
    listen 80;
    server_name _;  # Will match any hostname

    location / {
        proxy_pass http://localhost:19006;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

sudo mv temp_nginx_conf $NGINX_CONF_FILE

# For Ubuntu, create symlink if needed
if [ -d "/etc/nginx/sites-enabled" ] && [ ! -f "/etc/nginx/sites-enabled/obdfinder" ]; then
    sudo ln -s $NGINX_CONF_FILE /etc/nginx/sites-enabled/
fi

# Test and restart Nginx
echo "Testing Nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "Restarting Nginx..."
    sudo systemctl restart nginx
    sudo systemctl enable nginx
else
    echo "Nginx configuration test failed. Please check the configuration manually."
fi

echo "===== Deployment Completed! ====="
echo "Your application should now be running at http://YOUR_EC2_PUBLIC_IP"
echo "Remember to update the .env file with your actual API keys if this is a first-time setup." 