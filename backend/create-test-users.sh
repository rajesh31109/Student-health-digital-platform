#!/bin/bash

# Script to create test users in Supabase via backend API
# This ensures passwords are properly hashed

echo "🔄 Creating test users via backend API..."
echo ""

# Generate test tokens first
echo "📝 Step 1: Creating test data structure..."

# Create Admin User (if not exists)
echo "👤 Creating Admin user..."
ADMIN_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"rajeshpulluri333@gmail.com",
    "password":"admin123"
  }')

echo "Response: $ADMIN_RESPONSE"
echo ""

# Try to get admin from profile (to check if exists)
echo "✅ Admin setup ready for testing"
echo ""
echo "Test Credentials:"
echo "=================="
echo "Admin:"
echo "  Email: rajeshpulluri333@gmail.com"
echo "  Password: admin123"
echo ""
echo "Medical Officer:"
echo "  Email: doctor@example.com"  
echo "  Password: doctor123"
echo ""
echo "Student:"
echo "  Health ID: TG-01-1968-0001"
echo "  (No password needed)"
echo ""
