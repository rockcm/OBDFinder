# Deploying OBDFinder to AWS EC2

This guide walks through the process of deploying the OBDFinder application to an AWS EC2 instance.

## Prerequisites
- An AWS account
- Basic knowledge of AWS services
- SSH client for connecting to your EC2 instance

## Step 1: Launch an EC2 Instance

1. Sign in to the AWS Management Console
2. Navigate to EC2 Dashboard
3. Click "Launch Instance"
4. Choose an Amazon Machine Image (AMI)
   - Recommended: Amazon Linux 2023 or Ubuntu 22.04
5. Choose an Instance Type
   - Recommended: t2.micro (eligible for free tier) or t2.small
6. Configure Instance Details (use defaults or customize as needed)
7. Add Storage (default 8GB is usually sufficient)
8. Add Tags (optional)
9. Configure Security Group:
   - Allow SSH (Port 22) from your IP
   - Allow HTTP (Port 80)
   - Allow HTTPS (Port 443)
   - Allow Port 19006 (Expo web default port)
10. Review and Launch
11. Create or select an existing key pair and download it
12. Launch the instance

## Step 2: Connect to Your EC2 Instance

```bash
ssh -i /path/to/your-key-pair.pem ec2-user@your-ec2-public-dns
# For Ubuntu instances use: ubuntu@your-ec2-public-dns
```

## Step 3: Install Dependencies

```bash
# Update package lists
sudo yum update -y  # For Amazon Linux
# OR
sudo apt update     # For Ubuntu

# Install Node.js (v18 LTS recommended for Expo)
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -  # For Amazon Linux
# OR
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -  # For Ubuntu

sudo yum install -y nodejs  # For Amazon Linux
# OR
sudo apt install -y nodejs  # For Ubuntu

# Install Git
sudo yum install -y git  # For Amazon Linux
# OR
sudo apt install -y git  # For Ubuntu

# Install Expo CLI
sudo npm install -g expo-cli

# Install PM2 (process manager)
sudo npm install -g pm2
```

## Step 4: Clone the Repository

```bash
git clone [YOUR_REPOSITORY_URL] OBDFinder
cd OBDFinder
```

## Step 5: Set Up Environment Variables

1. Create an .env file:
```bash
touch .env
```

2. Add the following variables to your .env file:
```
YOUTUBE_API_KEY=your_youtube_api_key
```

## Step 6: Install Project Dependencies

```bash
npm install
```

## Step 7: Build the Web Version

```bash
npx expo export:web
```

## Step 8: Deploy with PM2

```bash
# Install Serve
npm install -g serve

# Start the application with PM2
pm2 start "serve web-build -p 19006" --name "OBDFinder"

# Set PM2 to start on boot
pm2 startup
sudo env PATH=$PATH:/usr/bin pm2 startup [system] -u [user] --hp [home-path]
pm2 save
```

## Step 9: Set Up Nginx as a Reverse Proxy (Optional but Recommended)

```bash
# Install Nginx
sudo yum install -y nginx  # For Amazon Linux
# OR
sudo apt install -y nginx  # For Ubuntu

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

Create an Nginx configuration file:

```bash
sudo nano /etc/nginx/conf.d/obdfinder.conf  # For Amazon Linux
# OR
sudo nano /etc/nginx/sites-available/obdfinder  # For Ubuntu
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;  # Or use your EC2 public IP/DNS

    location / {
        proxy_pass http://localhost:19006;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

For Ubuntu, link the configuration:
```bash
sudo ln -s /etc/nginx/sites-available/obdfinder /etc/nginx/sites-enabled/
```

Test and restart Nginx:
```bash
sudo nginx -t
sudo systemctl restart nginx
```

## Step 10: Set Up SSL with Let's Encrypt (Optional)

```bash
# Install Certbot
sudo yum install -y certbot python3-certbot-nginx  # For Amazon Linux
# OR
sudo apt install -y certbot python3-certbot-nginx  # For Ubuntu

# Obtain and install certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## Troubleshooting

### If changes don't appear after deployment:
```bash
pm2 restart OBDFinder
```

### Checking logs:
```bash
pm2 logs OBDFinder
```

### Checking Nginx errors:
```bash
sudo tail -f /var/log/nginx/error.log
```

## Additional Considerations

1. **Domain Name**: Consider setting up a domain name and pointing it to your EC2 instance
2. **Auto Scaling**: For production, consider using AWS Elastic Beanstalk or setting up auto-scaling
3. **Database**: If you add a database later, consider using AWS RDS
4. **CI/CD**: Set up a GitHub Actions workflow for continuous deployment 