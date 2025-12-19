#!/bin/bash

# Hostinger Deployment Script
# Run this script to prepare your backend for deployment

echo "🚀 Preparing backend for Hostinger deployment..."

# Step 1: Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
    echo "✅ Please update .env with your Hostinger credentials"
    exit 1
fi

# Step 2: Install dependencies
echo "📦 Installing production dependencies..."
npm install --production

# Step 3: Test database connection
echo "🔍 Testing database connection..."
node -e "
const { sequelize } = require('./models');
sequelize.authenticate()
    .then(() => {
        console.log('✅ Database connection successful!');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Database connection failed:', err.message);
        process.exit(1);
    });
"

# Step 4: Create deployment package
echo "📦 Creating deployment package..."
mkdir -p deployment
tar -czf deployment/backend-$(date +%Y%m%d-%H%M%S).tar.gz \
    --exclude='node_modules' \
    --exclude='.env' \
    --exclude='deployment' \
    --exclude='.git' \
    .

echo "✅ Deployment package created in deployment/ folder"
echo ""
echo "📋 Next steps:"
echo "1. Upload the .tar.gz file to Hostinger"
echo "2. Extract it in public_html/api/"
echo "3. Run: npm install --production"
echo "4. Create .env file with production credentials"
echo "5. Start with PM2: pm2 start server.js --name spa-backend"
echo ""
echo "🎉 Ready for deployment!"
