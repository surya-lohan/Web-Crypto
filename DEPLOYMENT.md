# 🚀 Deployment Guide - Vercel

Deploy your Web Crypto Wallet to Vercel in minutes!

---

## Prerequisites

- Vercel account (free): https://vercel.com/signup
- Git repository (GitHub, GitLab, or Bitbucket)
- Alchemy or Infura RPC URL

---

## Method 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Push Code to Git

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Web Crypto Wallet"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/WebCryptoWallet.git

# Push
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Import your Git repository
4. Vercel will auto-detect Vite configuration ✅

### Step 3: Configure Environment Variables

In the Vercel import screen:

**Add these environment variables**:

| Name | Value |
|------|-------|
| `VITE_RPC_URL` | `https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY` |
| `VITE_NETWORK_NAME` | `Sepolia` |
| `VITE_CHAIN_ID` | `11155111` |
| `VITE_ETHERSCAN_URL` | `https://sepolia.etherscan.io` |

⚠️ **Important**: Replace `YOUR_API_KEY` with your actual Alchemy/Infura key!

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait 1-2 minutes for build
3. ✅ Your wallet is live!

### Step 5: Get Your URL

You'll get a URL like:
```
https://your-project-name.vercel.app
```

---

## Method 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

### Step 2: Login

```bash
vercel login
```

Follow prompts to authenticate.

### Step 3: Deploy

```bash
# From project directory
vercel

# Follow prompts:
# Set up and deploy? Y
# Which scope? Select your account
# Link to existing project? N
# What's your project's name? web-crypto-wallet
# In which directory is your code located? ./
# Want to modify settings? N
```

### Step 4: Add Environment Variables

```bash
# Add RPC URL
vercel env add VITE_RPC_URL

# When prompted, paste your RPC URL:
# https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY

# Select environments: Production, Preview, Development
# (Select all with spacebar, then Enter)

# Repeat for other variables:
vercel env add VITE_NETWORK_NAME
# Enter: Sepolia

vercel env add VITE_CHAIN_ID
# Enter: 11155111

vercel env add VITE_ETHERSCAN_URL
# Enter: https://sepolia.etherscan.io
```

### Step 5: Redeploy with Environment Variables

```bash
vercel --prod
```

---

## Method 3: Deploy from Local Build

### Step 1: Build Locally

```bash
# Install dependencies
npm install

# Build
npm run build
```

This creates `dist/` folder with production files.

### Step 2: Deploy dist Folder

```bash
# Deploy the dist folder
vercel --prod dist/
```

---

## Post-Deployment Configuration

### 1. Custom Domain (Optional)

**Via Dashboard**:
1. Go to project settings
2. Click **"Domains"**
3. Add your domain: `wallet.yourdomain.com`
4. Follow DNS configuration instructions

**Via CLI**:
```bash
vercel domains add wallet.yourdomain.com
```

### 2. Enable HTTPS (Automatic)

Vercel automatically provisions SSL certificates.
- ✅ Free SSL via Let's Encrypt
- ✅ Auto-renewal
- ✅ Force HTTPS enabled by default

### 3. Set Up Redirects (Optional)

Create `vercel.json` in project root:

```json
{
  "redirects": [
    {
      "source": "/",
      "has": [
        {
          "type": "header",
          "key": "x-forwarded-proto",
          "value": "http"
        }
      ],
      "destination": "https://your-domain.vercel.app",
      "permanent": true
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "no-referrer"
        }
      ]
    }
  ]
}
```

Then redeploy:
```bash
vercel --prod
```

---

## Continuous Deployment

### Auto-Deploy on Git Push

Vercel automatically deploys when you push to your repository!

```bash
# Make changes
git add .
git commit -m "Update wallet features"
git push

# Vercel automatically:
# 1. Detects push
# 2. Builds project
# 3. Deploys to preview URL
# 4. (If main branch) deploys to production
```

### Branch Deployments

- **Main/Master branch** → Production
- **Other branches** → Preview deployments

Each PR gets its own preview URL!

---

## Environment Management

### Production vs Preview

**Production**:
- Deployed from `main` branch
- Uses production environment variables
- URL: `https://your-project.vercel.app`

**Preview**:
- Deployed from feature branches
- Uses preview environment variables
- URL: `https://your-project-git-branch.vercel.app`

### Update Environment Variables

**Via Dashboard**:
1. Go to project settings
2. Click **"Environment Variables"**
3. Edit or add variables
4. Redeploy to apply changes

**Via CLI**:
```bash
# Remove old variable
vercel env rm VITE_RPC_URL

# Add new one
vercel env add VITE_RPC_URL

# Redeploy
vercel --prod
```

---

## Monitoring & Analytics

### Built-in Analytics

Vercel provides:
- ✅ Page views
- ✅ Top pages
- ✅ Top referrers
- ✅ Device breakdown
- ✅ Countries

Access at: `https://vercel.com/your-username/your-project/analytics`

### Performance Metrics

Monitor:
- Build times
- Bundle size
- Core Web Vitals
- Edge network performance

---

## Troubleshooting

### Build Fails

**Error**: "Command failed: npm run build"

**Solutions**:
```bash
# 1. Check build locally first
npm run build

# 2. Check Node version
# Vercel uses Node 18 by default
# Add to package.json:
{
  "engines": {
    "node": "18.x"
  }
}

# 3. Clear Vercel cache
vercel --force
```

### Environment Variables Not Working

**Error**: "RPC URL not configured"

**Solutions**:
1. Verify variables start with `VITE_`
2. Redeploy after adding variables
3. Check spelling exactly matches code

**Debug**:
```bash
# List environment variables
vercel env ls

# Pull environment to local
vercel env pull .env.local
```

### 404 on Refresh

**Problem**: SPA routing doesn't work

**Solution**: Create `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Bundle Too Large

**Error**: "Exceeds maximum bundle size"

**Solutions**:
```bash
# 1. Analyze bundle
npm install -D vite-plugin-visualizer

# Add to vite.config.ts:
import { visualizer } from 'vite-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer()
  ],
});

# 2. Enable code splitting
# 3. Remove unused dependencies
# 4. Use dynamic imports
```

---

## Security Best Practices

### 1. Environment Variables

**✅ DO**:
- Use Vercel environment variables
- Never commit `.env` to Git
- Different keys for preview vs production

**❌ DON'T**:
- Hardcode API keys in code
- Use same key for test and production
- Share keys in public repos

### 2. HTTPS Only

Vercel enforces HTTPS by default ✅

### 3. Security Headers

Add to `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=63072000; includeSubDomains; preload"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "no-referrer"
        },
        {
          "key": "Permissions-Policy",
          "value": "geolocation=(), microphone=(), camera=()"
        }
      ]
    }
  ]
}
```

---

## Cost & Limits

### Free Tier (Hobby)

- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Analytics
- ❌ No commercial use
- ❌ No custom deployment regions

### Pro Tier ($20/month)

- ✅ Commercial use allowed
- ✅ 1 TB bandwidth/month
- ✅ Advanced analytics
- ✅ Password protection
- ✅ Priority support

**This wallet**: Free tier is sufficient for testing/demo

---

## Performance Optimization

### 1. Enable Edge Network

Vercel uses global CDN by default ✅

### 2. Enable Compression

```json
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Encoding",
          "value": "gzip"
        }
      ]
    }
  ]
}
```

### 3. Cache Static Assets

Vercel automatically caches:
- Images
- CSS
- JavaScript
- Fonts

---

## Rollback

### Via Dashboard

1. Go to deployments
2. Find previous deployment
3. Click **"︙"** → **"Promote to Production"**

### Via CLI

```bash
# List deployments
vercel ls

# Rollback to specific deployment
vercel rollback [deployment-url]
```

---

## Custom Scripts

### Pre-build Script

```json
// package.json
{
  "scripts": {
    "vercel-build": "npm run lint && npm run build"
  }
}
```

Vercel will run `vercel-build` instead of `build`.

---

## Webhooks

### Deploy on External Event

1. Go to project settings
2. Click **"Git"** → **"Deploy Hooks"**
3. Create hook
4. Use webhook URL to trigger deployments

Example:
```bash
curl -X POST https://api.vercel.com/v1/integrations/deploy/...
```

---

## Success Checklist

After deployment, verify:

- [ ] Site loads at Vercel URL
- [ ] Environment variables working
- [ ] Can create wallet
- [ ] Can send transactions
- [ ] Dark mode works
- [ ] MetaMask connects
- [ ] HTTPS enabled
- [ ] No console errors

---

## Next Steps

1. **Test Thoroughly**
   - Test on mobile devices
   - Test different browsers
   - Test all features

2. **Share**
   - Get the Vercel URL
   - Share with friends for testing
   - Get feedback

3. **Monitor**
   - Check analytics
   - Monitor error logs
   - Watch performance

4. **Iterate**
   - Make improvements
   - Push to Git
   - Auto-deploys!

---

## Support

**Vercel Documentation**: https://vercel.com/docs
**Vercel Discord**: https://vercel.com/discord
**Status Page**: https://vercel-status.com/

---

**Your wallet is now live on Vercel! 🎉**

Remember: This is for testing and education only!
