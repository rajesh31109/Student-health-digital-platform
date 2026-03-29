#!/bin/bash
echo "Getting Vercel deployment logs..."
npx vercel logs --follow 2>&1 | head -500
