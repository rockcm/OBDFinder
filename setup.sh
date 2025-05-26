#!/bin/bash

# OBDFinder EC2 Setup Script
# Run this script after cloning the repository to set up the application

echo "===== Setting up OBDFinder on EC2 ====="

# Check for .env file and create if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    echo "YOUTUBE_API_KEY=your_youtube_api_key" > .env
    echo -e "\033[33mWARNING: Please update the .env file with your actual YouTube API key\033[0m"
fi

# Install project dependencies
echo "Installing project dependencies..."
npm install

# Build the web version
echo "Building web version..."
npx expo export:web

# Check if global dependencies are installed
if ! command -v serve &> /dev/null || ! command -v pm2 &> /dev/null; then
    echo "Installing required global npm packages..."
    sudo npm install -g serve pm2
fi

# Set up PM2 to run the application
echo "Starting application with PM2..."
pm2 start "serve web-build -p 19006" --name "OBDFinder"
pm2 save

# Set up PM2 to start on boot
echo "Setting up PM2 to start on boot..."
pm2 startup | grep "sudo" > startup_command.sh
chmod +x startup_command.sh
sudo bash startup_command.sh
rm startup_command.sh

# Configure Nginx (if installed)
if command -v nginx &> /dev/null; then
    echo "Setting up Nginx configuration..."
    
    # Determine Nginx configuration directory
    if [ -d "/etc/nginx/conf.d" ]; then
        NGINX_CONF_FILE="/etc/nginx/conf.d/obdfinder.conf"
    elif [ -d "/etc/nginx/sites-available" ]; then
        NGINX_CONF_FILE="/etc/nginx/sites-available/obdfinder"
    else
        echo -e "\033[33mCould not determine Nginx configuration directory. Please configure manually.\033[0m"
        NGINX_CONF_FILE=""
    fi
    
    if [ -n "$NGINX_CONF_FILE" ]; then
        # Create configuration file
        echo "Creating Nginx configuration at $NGINX_CONF_FILE..."
        
        cat > nginx_config << 'EOF'
server {
    listen 80;
    server_name _;

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
        
        sudo mv nginx_config $NGINX_CONF_FILE
        
        # Link configuration (if needed)
        if [ -d "/etc/nginx/sites-enabled" ] && [ ! -f "/etc/nginx/sites-enabled/obdfinder" ]; then
            sudo ln -s $NGINX_CONF_FILE /etc/nginx/sites-enabled/obdfinder
        fi
        
        # Test and reload Nginx
        echo "Testing and reloading Nginx configuration..."
        sudo nginx -t && sudo systemctl reload nginx
    fi
else
    echo -e "\033[33mNginx not detected. For better performance and to expose the app on port 80,"
    echo -e "consider installing Nginx:\033[0m"
    echo -e "  sudo yum install -y nginx  # For Amazon Linux"
    echo -e "  sudo apt install -y nginx  # For Ubuntu"
fi

echo "===== Setup Complete ====="
echo ""
echo "Your application should now be running at:"
echo "  - http://localhost:19006"
if command -v nginx &> /dev/null; then
    echo "  - http://your-ec2-ip-address"
fi
echo ""
echo "To check application status: pm2 list"
echo "To view application logs: pm2 logs OBDFinder"
echo "To restart application: pm2 restart OBDFinder" 