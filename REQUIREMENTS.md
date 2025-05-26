# OBDFinder EC2 Deployment Requirements

## System Requirements

### Minimum System Specifications
- AWS EC2 instance: t2.micro (1 vCPU, 1GB RAM) or better
- Storage: 8GB or more
- Operating System: Amazon Linux 2023 or Ubuntu 22.04 LTS

### Required Software
- Node.js 18.x or later
- npm 8.x or later
- Git
- Nginx (for reverse proxy)
- PM2 (process manager)

### Global npm Packages
```bash
npm install -g expo-cli pm2 serve
```

## Application Setup

### Environment Variables
Create a `.env` file in the project root with:
```
YOUTUBE_API_KEY=your_youtube_api_key
```

### Required Ports
Ensure these ports are open in your EC2 security group:
- 22 (SSH)
- 80 (HTTP)
- 443 (HTTPS)
- 19006 (Expo web development server)

## Quick Setup Commands

### System Dependencies (Amazon Linux)
```bash
# Update system
sudo yum update -y

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install Git
sudo yum install -y git

# Install Nginx
sudo yum install -y nginx
```

### System Dependencies (Ubuntu)
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Git
sudo apt install -y git

# Install Nginx
sudo apt install -y nginx
```

### Clone Repository
```bash
git clone https://github.com/YourUsername/OBDFinder.git
cd OBDFinder
```

### Application Dependencies
```bash
npm install
```

### Build Process
```bash
npx expo export:web
```

### Deployment 
```bash
# Install global dependencies
sudo npm install -g expo-cli pm2 serve

# Start application
pm2 start "serve web-build -p 19006" --name "OBDFinder"
pm2 save
pm2 startup
```

## Verification Steps

After deployment, verify the following:

1. The application is running: `pm2 list`
2. The application is accessible via Nginx: http://[EC2_PUBLIC_IP]
3. The application loads correctly in a web browser
4. Environment variables are properly configured

## Troubleshooting

If you encounter issues:

1. Check application logs: `pm2 logs OBDFinder`
2. Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify security groups are properly configured
4. Ensure all dependencies are installed correctly: `npm list` 