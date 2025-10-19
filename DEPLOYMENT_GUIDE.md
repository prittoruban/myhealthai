# Deployment Guide for MyHealthAI

## 🚀 Deploying to Vercel

### Step 1: Environment Variables Setup

You **MUST** set the following environment variables in your Vercel project settings:

#### 1. Navigate to Vercel Dashboard
- Go to your project on Vercel
- Click on **Settings** → **Environment Variables**

#### 2. Add Required Variables

**MONGODB_URI**
```
mongodb+srv://prittoprogrammer_db_user:Jesus%40123@cluster0.7o9aaht.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```
- ⚠️ **Important**: Make sure special characters in password are URL-encoded
  - `@` becomes `%40`
  - `#` becomes `%23`
  - `$` becomes `%24`
  - etc.

**NEXTAUTH_URL**
```
https://myhealthaione.vercel.app
```
- ⚠️ **Must be your actual deployment URL**
- ⚠️ **No trailing slash**
- For custom domain: `https://yourdomain.com`

**NEXTAUTH_SECRET**
```
Generate a new one with: openssl rand -base64 32
```
Example output: `Xz8K9mP2vL5nQ3wR7tY6uI1oA4sD8fG0hJ3kL9mN2bV=`

- ⚠️ **NEVER use the development secret in production**
- ⚠️ **Must be at least 32 characters long**

#### 3. Set Environment for All Environments
Make sure to set these for:
- ✅ Production
- ✅ Preview
- ✅ Development

### Step 2: Verify MongoDB Connection

1. **Whitelist Vercel IP addresses** in MongoDB Atlas:
   - Go to MongoDB Atlas → Network Access
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Or add specific Vercel IP ranges

2. **Test connection string**:
   - Make sure your MongoDB user has read/write permissions
   - Database name should match in the connection string

### Step 3: Deploy

```bash
# Method 1: Push to GitHub (Automatic deployment)
git add .
git commit -m "Add production environment variables"
git push origin main

# Method 2: Deploy from CLI
vercel --prod
```

### Step 4: Test the Deployment

1. **Visit your deployed site**: https://myhealthaione.vercel.app
2. **Try the Quick Demo button** in the navbar
3. **Check if authentication works**:
   - Login page: https://myhealthaione.vercel.app/login
   - Register page: https://myhealthaione.vercel.app/register
   - Demo: Click "✨ Quick Demo" button

### Common Issues & Solutions

#### Issue 1: "MIDDLEWARE_INVOCATION_FAILED"
**Cause**: Missing or incorrect `NEXTAUTH_URL` or `NEXTAUTH_SECRET`

**Solution**:
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add/Update `NEXTAUTH_URL` with your actual domain
3. Generate new `NEXTAUTH_SECRET`: `openssl rand -base64 32`
4. Redeploy the project

#### Issue 2: Authentication Redirect Loop
**Cause**: `NEXTAUTH_URL` doesn't match deployment URL

**Solution**:
- Make sure `NEXTAUTH_URL=https://myhealthaione.vercel.app` (exact URL)
- No trailing slash
- Use HTTPS, not HTTP

#### Issue 3: Database Connection Failed
**Cause**: MongoDB network access restrictions

**Solution**:
1. MongoDB Atlas → Network Access
2. Allow access from anywhere (0.0.0.0/0)
3. Verify connection string is correct
4. Check if password has special characters (must be URL-encoded)

#### Issue 4: "NEXTAUTH_SECRET not defined"
**Cause**: Environment variable not set in Vercel

**Solution**:
```bash
# Generate a secure secret
openssl rand -base64 32

# Add it to Vercel environment variables
# Then redeploy
```

### Checking Deployment Logs

1. Go to Vercel Dashboard → Your Project
2. Click on "Deployments"
3. Click on the latest deployment
4. Check "Function Logs" for errors
5. Look for:
   - MongoDB connection errors
   - NextAuth configuration errors
   - Missing environment variables

### Quick Fix Checklist

- [ ] `NEXTAUTH_URL` set to production URL
- [ ] `NEXTAUTH_SECRET` is 32+ characters (not the dev one)
- [ ] `MONGODB_URI` has URL-encoded password
- [ ] MongoDB Atlas allows Vercel IP (0.0.0.0/0)
- [ ] All environment variables set for Production, Preview, Development
- [ ] Redeployed after adding environment variables

### Test URLs

After deployment, test these URLs:

1. **Home**: https://myhealthaione.vercel.app/
2. **Login**: https://myhealthaione.vercel.app/login
3. **Register**: https://myhealthaione.vercel.app/register
4. **Dashboard**: https://myhealthaione.vercel.app/dashboard (requires login)
5. **API Health**: https://myhealthaione.vercel.app/api/user

### Generate New NEXTAUTH_SECRET

**Option 1: OpenSSL**
```bash
openssl rand -base64 32
```

**Option 2: Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Option 3: Online Generator**
- Visit: https://generate-secret.vercel.app/32

### MongoDB Connection String Format

```
mongodb+srv://<username>:<URL_ENCODED_PASSWORD>@<cluster>.mongodb.net/?retryWrites=true&w=majority&appName=<AppName>
```

**Example with special characters**:
- Password: `Jesus@123` → `Jesus%40123`
- Password: `Pass#word$1` → `Pass%23word%241`

---

## 🔒 Security Checklist

- [ ] Strong NEXTAUTH_SECRET (32+ characters, random)
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Environment variables not exposed in code
- [ ] MongoDB user has minimal required permissions
- [ ] MongoDB network access properly configured

---

## 📞 Still Having Issues?

1. Check Vercel function logs
2. Check MongoDB Atlas logs
3. Verify all environment variables are set
4. Clear browser cache and cookies
5. Try incognito/private browsing mode

---

**Last Updated**: October 19, 2025
