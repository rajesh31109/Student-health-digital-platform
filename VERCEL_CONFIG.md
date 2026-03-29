vercel.json Configuration for Frontend Deployment

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "env": {
    "VITE_API_URL": "@vite-api-url"
  },
  "build": {
    "env": {
      "VITE_API_URL": "@vite-api-url"
    }
  }
}
```

Add this as vercel.json in the root of your project.
