# MyHealthAI - Quick Setup Guide

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up MongoDB

### Option A: Using Local MongoDB

1. Install MongoDB Community Edition:
   - **Ubuntu/Debian**: `sudo apt-get install mongodb`
   - **macOS**: `brew tap mongodb/brew && brew install mongodb-community`
   - **Windows**: Download from [mongodb.com](https://www.mongodb.com/try/download/community)

2. Start MongoDB:
   ```bash
   # Linux
   sudo systemctl start mongod
   
   # macOS
   brew services start mongodb-community
   
   # Windows
   net start MongoDB
   ```

3. Verify MongoDB is running:
   ```bash
   mongosh
   ```

### Option B: Using MongoDB Atlas (Cloud)

1. Create a free account at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Set up database access (username/password)
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string

## Step 3: Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your settings:

```env
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/myhealthai

# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/myhealthai?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret-here
```

Generate a secure `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

## Step 4: Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 5: Test the Application

1. **Register**: Go to `/register` and create an account
2. **Login**: Sign in with your credentials
3. **Dashboard**: You'll be redirected to the dashboard
4. **Log a Meal**: Click "+ Log Meal" and add your first entry
5. **Search Recipes**: Try searching for "Dosa" or "Dal Tadka" in RasoiAI

## Troubleshooting

### MongoDB Connection Issues

**Error**: `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution**: 
- Ensure MongoDB is running: `sudo systemctl status mongod`
- Check if MongoDB is listening on port 27017: `netstat -an | grep 27017`
- Verify MONGODB_URI in `.env.local`

### NextAuth Issues

**Error**: `[next-auth][error][NO_SECRET]`

**Solution**: 
- Ensure NEXTAUTH_SECRET is set in `.env.local`
- Generate a new secret: `openssl rand -base64 32`

### Port Already in Use

**Error**: `Port 3000 is already in use`

**Solution**:
```bash
# Find and kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or run on a different port
PORT=3001 npm run dev
```

## Database Seeding (Optional)

To add sample data for testing:

```bash
# Connect to MongoDB
mongosh

# Use the database
use myhealthai

# The application will create collections automatically on first use
```

## Building for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

## Next Steps

- Customize the daily oil goal in User model
- Add more recipes to `data/recipes.json`
- Implement user profile editing
- Add data visualization charts
- Deploy to Vercel or your preferred hosting platform

## Support

For issues or questions:
1. Check the main README.md
2. Review the troubleshooting section
3. Open an issue on GitHub

Happy tracking! 🎯
