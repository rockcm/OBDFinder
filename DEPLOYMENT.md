# EC2 Deployment Guide for OBD Finder React Native Web App

This guide will help you deploy your React Native Expo web application to an Amazon EC2 instance using Docker.

## Prerequisites

- AWS Account with EC2 access
- SSH key pair for EC2 access
- Your source code pushed to a Git repository

## Step 1: Launch EC2 Instance

1. **Launch a new EC2 instance:**
   - AMI: Amazon Linux 2 or Ubuntu 20.04/22.04
   - Instance Type: t3.small or larger (minimum t2.micro for testing)
   - Storage: 20GB GP3 (minimum 10GB)
   - Security Group: Allow SSH (port 22) and HTTP (port 80)

2. **Configure Security Group:**
   ```
   Type        Protocol    Port Range    Source
   SSH         TCP         22           Your IP (0.0.0.0/0 for testing)
   HTTP        TCP         80           0.0.0.0/0
   Custom TCP  TCP         3000         0.0.0.0/0
   HTTPS       TCP         443          0.0.0.0/0 (for future SSL)
   ```

## Step 2: Connect to Your EC2 Instance

```bash
ssh -i your-key.pem ec2-user@your-ec2-public-ip
```

## Step 3: Run the Deployment Script

1. **Download the deployment script:**
   ```bash
   curl -O https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/deploy-ec2.sh
   ```
   
   Or copy the script directly to your EC2 instance:
   ```bash
   nano deploy-ec2.sh
   # Paste the script content and save
   ```

2. **Make the script executable:**
   ```bash
   chmod +x deploy-ec2.sh
   ```

3. **Edit the script to add your repository URL:**
   ```bash
   nano deploy-ec2.sh
   ```
   Replace `<YOUR_REPOSITORY_URL>` with your actual Git repository URL:
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git $APP_DIR
   ```

4. **Run the deployment script:**
   ```bash
   ./deploy-ec2.sh
   ```

## Step 4: Manual Deployment (Alternative)

If you prefer to deploy manually:

1. **Install Docker and Git:**
   ```bash
   # For Amazon Linux 2
   sudo yum update -y
   sudo yum install -y docker git
   
   # For Ubuntu
   sudo apt-get update
   sudo apt-get install -y docker.io docker-compose git
   ```

2. **Start Docker:**
   ```bash
   sudo systemctl start docker
   sudo systemctl enable docker
   sudo usermod -a -G docker $USER
   ```
   Log out and back in for group changes to take effect.

3. **Clone your repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
   cd YOUR_REPO
   ```

4. **Build and run with Docker Compose:**
   ```bash
   sudo docker-compose build
   sudo docker-compose up -d
   ```

## Step 5: Verify Deployment

1. **Check if containers are running:**
   ```bash
   sudo docker-compose ps
   ```

2. **View logs:**
   ```bash
   sudo docker-compose logs -f
   ```

3. **Test the application:**
   ```bash
   curl http://localhost:3000
   ```

4. **Access from browser:**
   - Open `http://YOUR_EC2_PUBLIC_IP:3000` in your browser

## Useful Commands

### Application Management
```bash
# View logs
sudo docker-compose logs -f

# Restart application
sudo docker-compose restart

# Stop application
sudo docker-compose down

# Update application
git pull origin main
sudo docker-compose build --no-cache
sudo docker-compose up -d

# View container status
sudo docker-compose ps

# Execute commands in container
sudo docker-compose exec obd-finder-web sh
```

### System Monitoring
```bash
# Check disk usage
df -h

# Check memory usage
free -m

# Check running processes
top

# Check Docker status
sudo systemctl status docker
```

## SSL/HTTPS Setup (Optional)

To add SSL certificate using Let's Encrypt:

1. **Install Certbot:**
   ```bash
   # Amazon Linux 2
   sudo yum install -y certbot

   # Ubuntu
   sudo apt-get install -y certbot
   ```

2. **Get SSL certificate:**
   ```bash
   sudo certbot certonly --standalone -d your-domain.com
   ```

3. **Update nginx configuration to use SSL** (modify `nginx.conf`)

## Monitoring and Maintenance

### Set up automatic updates:
```bash
# Create update script
cat > ~/update-app.sh << 'EOF'
#!/bin/bash
cd /home/ec2-user/obd-finder
git pull origin main
sudo docker-compose build --no-cache
sudo docker-compose up -d
EOF

chmod +x ~/update-app.sh

# Add to crontab for weekly updates (optional)
# crontab -e
# 0 2 * * 0 /home/ec2-user/update-app.sh
```

### Log rotation:
```bash
# Docker logs are automatically rotated, but you can configure:
sudo nano /etc/docker/daemon.json
```

Add:
```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

## Troubleshooting

### Container won't start:
```bash
# Check detailed logs
sudo docker-compose logs

# Check if port is in use
sudo netstat -tulpn | grep :3000

# Rebuild from scratch
sudo docker-compose down
sudo docker system prune -a
sudo docker-compose build --no-cache
sudo docker-compose up -d
```

### Application not accessible:
1. Check security group allows port 3000
2. Check if EC2 instance has a public IP
3. Verify nginx is running inside container
4. Check firewall settings

### Build failures:
1. Ensure you have enough disk space (`df -h`)
2. Check if npm dependencies are properly installed
3. Verify Node.js version compatibility

## Cost Optimization

- Use t3.micro for development (free tier eligible)
- Stop instance when not in use
- Use reserved instances for production
- Set up CloudWatch alarms for cost monitoring

## Security Best Practices

- Regularly update the EC2 instance
- Use IAM roles instead of access keys when possible
- Enable CloudTrail for audit logging
- Set up VPC with private subnets for production
- Use Application Load Balancer for high availability
- Implement proper backup strategy

## Support

If you encounter issues:
1. Check the logs: `sudo docker-compose logs -f`
2. Verify all environment variables are set correctly
3. Ensure your Git repository is accessible
4. Check EC2 instance specifications meet requirements 