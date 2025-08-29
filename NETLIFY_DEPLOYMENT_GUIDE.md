# Netlify Deployment Guide for Altroway

This guide will walk you through deploying your Altroway application to Netlify.

## Prerequisites

1. **GitHub Repository**: Your code must be pushed to a GitHub repository
2. **Netlify Account**: Sign up at [netlify.com](https://netlify.com)
3. **Supabase Project**: Ensure your Supabase project is properly configured

## Step 1: Prepare Your Repository

### 1.1 Push Your Code to GitHub
```bash
git add .
git commit -m "Prepare for Netlify deployment"
git push origin main
```

### 1.2 Verify Configuration Files
Ensure these files are in your repository:
- ✅ `netlify.toml` - Netlify configuration
- ✅ `next.config.mjs` - Next.js configuration
- ✅ `package.json` - Dependencies and scripts

## Step 2: Deploy to Netlify

### 2.1 Connect to GitHub
1. Go to [netlify.com](https://netlify.com) and sign in
2. Click "New site from Git"
3. Choose "GitHub" as your Git provider
4. Authorize Netlify to access your GitHub account
5. Select your Altroway repository

### 2.2 Configure Build Settings
Use these exact settings:

**Build command:**
```bash
npm run build
```

**Publish directory:**
```
.next
```

**Node version:**
```
18
```

### 2.3 Set Environment Variables
Click on "Environment variables" and add these:

#### Required Variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

#### Optional Variables:
```
NEXTAUTH_URL=https://your-site-name.netlify.app
NEXTAUTH_SECRET=your_nextauth_secret
```

### 2.4 Deploy
1. Click "Deploy site"
2. Wait for the build to complete (usually 2-5 minutes)
3. Your site will be available at `https://random-name.netlify.app`

## Step 3: Configure Custom Domain (Optional)

### 3.1 Add Custom Domain
1. Go to "Domain settings" in your Netlify dashboard
2. Click "Add custom domain"
3. Enter your domain (e.g., `altroway.com`)
4. Follow the DNS configuration instructions

### 3.2 Update Environment Variables
After setting up custom domain, update:
```
NEXTAUTH_URL=https://yourdomain.com
```

## Step 4: Post-Deployment Configuration

### 4.1 Update Supabase Settings
1. Go to your Supabase project dashboard
2. Navigate to "Authentication" → "URL Configuration"
3. Add your Netlify domain to:
   - Site URL: `https://yourdomain.com`
   - Redirect URLs: `https://yourdomain.com/auth/callback`

### 4.2 Test Your Application
Verify these features work:
- ✅ User registration and login
- ✅ Job posting and application
- ✅ Messaging system
- ✅ Profile management
- ✅ Admin functions

## Step 5: Continuous Deployment

### 5.1 Automatic Deploys
- Every push to your `main` branch will automatically trigger a new deployment
- Netlify will show build status and deployment previews

### 5.2 Preview Deployments
- Pull requests get automatic preview deployments
- Test changes before merging to main

## Troubleshooting

### Common Issues:

#### 1. Build Failures
- Check build logs in Netlify dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

#### 2. Environment Variables
- Double-check variable names (case-sensitive)
- Ensure no extra spaces or quotes
- Restart deployment after adding variables

#### 3. API Routes Not Working
- Verify Supabase credentials
- Check CORS settings in Supabase
- Ensure environment variables are set correctly

#### 4. Authentication Issues
- Verify redirect URLs in Supabase
- Check `NEXTAUTH_URL` environment variable
- Ensure callback routes are properly configured

### 5.3 Performance Optimization
- Enable Netlify's CDN features
- Use image optimization
- Enable compression and caching

## Monitoring and Analytics

### 6.1 Netlify Analytics
- View site performance metrics
- Monitor build times and success rates
- Track form submissions and redirects

### 6.2 Error Tracking
- Set up error monitoring (e.g., Sentry)
- Monitor API response times
- Track user experience metrics

## Security Considerations

### 7.1 Environment Variables
- Never commit sensitive keys to Git
- Use Netlify's encrypted environment variables
- Regularly rotate API keys

### 7.2 CORS and Security Headers
- Configure proper CORS policies in Supabase
- Set security headers in `netlify.toml`
- Enable HTTPS enforcement

## Support Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Supabase Documentation](https://supabase.com/docs)

## Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Netlify account created
- [ ] Repository connected to Netlify
- [ ] Build settings configured
- [ ] Environment variables set
- [ ] Initial deployment successful
- [ ] Custom domain configured (if applicable)
- [ ] Supabase settings updated
- [ ] All features tested
- [ ] Performance optimized
- [ ] Monitoring configured

---

**Note**: This deployment uses Netlify's serverless functions for API routes. If you need more complex server-side functionality, consider using Netlify's Edge Functions or migrating to a different hosting provider.
