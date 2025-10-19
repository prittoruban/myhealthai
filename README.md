# MyHealthAI

A culturally aware web application designed to help Indian users track and reduce their daily edible oil consumption. Built with modern web technologies and a layered architecture for maintainability and scalability.

> **🏆 COMPETITION-READY UPDATE**: Now includes Quick Demo button in navbar, RasoiAI demo suggestions, testimonials, social proof, premium animations, and judge-friendly features! See [COMPETITION_SUMMARY.md](./COMPETITION_SUMMARY.md) for complete details.

## 🚀 Quick Demo for Judges/Evaluators

**Try it instantly - THREE WAYS!**

1. **Quick Demo Button** (FASTEST ⚡)
   - Click the **"✨ Quick Demo"** button in the navigation bar
   - Pulsing pink badge for easy spotting
   - One-click auto-login to demo account
   - Instant dashboard access

2. **Demo Banner**
   - Click **"Try Demo Now - One Click!"** banner at the top of homepage
   - Automatically logged in with pre-populated data

3. **Manual Login** (if needed)
   - Email: `demo@myhealthai.com`
   - Password: `demo123`

### What's Included in Demo:
- ✅ 17 sample meals across 7 days
- ✅ Weekly consumption trends with visual graphs
- ✅ Personalized health insights
- ✅ 75 gamification points
- ✅ RasoiAI with demo recipe suggestions (Dosa, Poha, Paratha, Dal, Paneer, Biryani)
- ✅ Progress tracking with circular indicators

For complete evaluation guidelines, see [EVALUATION.md](./EVALUATION.md)

---

## 🎯 Features

### 🆕 Competition-Ready Enhancements

- **✨ Quick Demo Button**: Prominent navbar button with pulsing animation for instant demo access
- **🍳 RasoiAI Demo Suggestions**: Popular dish chips (6 suggestions) for easy recipe exploration
- **💬 Testimonials Section**: User reviews with ratings and social proof
- **🎨 Premium Dark UI**: Custom pink/magenta theme with glassmorphism effects
- **🎬 Smooth Animations**: Scale-in, fade-in, float, and glow-pulse effects
- **📱 Fully Responsive**: Optimized for desktop, tablet, and mobile
- **🎯 Judge-Optimized**: Clear CTAs, instant demo, pre-populated data

### Core Features

- **🚀 One-Click Demo**: Instant access with pre-populated data for judges/evaluators
- **🔐 User Authentication**: Secure email/password authentication using NextAuth.js
- **📊 Oil Consumption Tracking**: Log meals with oil type and quantity used
- **📈 Visual Progress Tracking**: Real-time circular progress indicators and weekly trends
- **🍳 RasoiAI Recipe Search**: Discover healthy, low-oil Indian recipes
- **🎮 Gamification System**: Earn points for consistent tracking to stay motivated
- **🎯 Daily Goals**: Set and monitor daily oil consumption goals (default: 30ml)
- **✨ Smooth Animations**: Framer Motion for seamless page transitions
- **🔔 Toast Notifications**: Instant feedback for all actions
- **💡 AI-Powered Insights**: Personalized recommendations based on consumption patterns

## 🏗️ Architecture

This project follows a **layered architecture** with clear separation of concerns:

### 1. Data Layer (`lib/`, `models/`)
- **MongoDB Connection** (`lib/mongodb.ts`): Handles database connections with caching
- **User Model** (`models/user.model.ts`): User schema with email, password, goals, and points
- **Consumption Log Model** (`models/log.model.ts`): Tracks meal entries with oil usage

### 2. Application Layer (`app/api/`)
- **Authentication API** (`app/api/auth/`): NextAuth.js routes for login/registration
- **Logs API** (`app/api/logs/`): CRUD operations for consumption logs
- **User Profile API** (`app/api/user/`): Fetch user profile data
- **RasoiAI Recipe API** (`app/api/rasoiai/recipe/`): Recipe search functionality

### 3. Presentation Layer (`app/`, `components/`)
- **Pages**: Login, Register, Dashboard, Home
- **Reusable Components**: ProgressCircle, LogMealModal, RasoiAISearch
- **Session Management**: Client-side session handling with SessionProvider

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: [NextAuth.js v5](https://next-auth.js.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Language**: TypeScript
- **Password Hashing**: bcryptjs

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd myhealthai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory and add the following:

```env
# MongoDB Connection String
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/myhealthai

# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/myhealthai?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production
```

**Generate a secure NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 4. Start MongoDB (if using local installation)

```bash
# On Linux/macOS
sudo systemctl start mongod

# On Windows
net start MongoDB
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
myhealthai/
├── app/
│   ├── api/                    # API routes (Application Layer)
│   │   ├── auth/
│   │   │   ├── [...nextauth]/
│   │   │   │   └── route.ts   # NextAuth configuration
│   │   │   └── register/
│   │   │       └── route.ts   # User registration
│   │   ├── logs/
│   │   │   └── route.ts       # Consumption logs CRUD
│   │   ├── rasoiai/
│   │   │   └── recipe/
│   │   │       └── route.ts   # Recipe search
│   │   └── user/
│   │       └── route.ts       # User profile
│   ├── dashboard/
│   │   └── page.tsx           # Main dashboard (protected)
│   ├── login/
│   │   └── page.tsx           # Login page
│   ├── register/
│   │   └── page.tsx           # Registration page
│   ├── layout.tsx             # Root layout with providers
│   ├── page.tsx               # Landing page
│   └── globals.css            # Global styles
├── components/                 # Reusable UI components (Presentation Layer)
│   ├── LogMealModal.tsx       # Modal for logging meals
│   ├── ProgressCircle.tsx     # Circular progress indicator
│   ├── Providers.tsx          # Session provider wrapper
│   └── RasoiAISearch.tsx      # Recipe search component
├── data/
│   └── recipes.json           # Local recipe database
├── lib/                        # Data Layer utilities
│   └── mongodb.ts             # MongoDB connection
├── models/                     # Data Layer schemas
│   ├── log.model.ts           # Consumption log schema
│   └── user.model.ts          # User schema
├── types/
│   └── next-auth.d.ts         # NextAuth type definitions
├── .env.example               # Example environment variables
├── .env.local                 # Your local environment variables (create this)
├── package.json
├── tsconfig.json
└── README.md
```

## 🔐 Authentication Flow

1. **Registration**: User creates account with email/password
2. **Password Hashing**: Passwords are hashed using bcryptjs (salt rounds: 10)
3. **Login**: Credentials verified via NextAuth.js Credentials Provider
4. **Session Management**: JWT-based sessions stored client-side
5. **Protected Routes**: Dashboard requires active session

## 📊 Database Schema

### User Collection
```typescript
{
  email: String (unique, required),
  password: String (hashed, required),
  dailyOilGoal: Number (default: 30),
  points: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### ConsumptionLog Collection
```typescript
{
  userId: ObjectId (ref: User),
  mealName: String (required),
  oilType: String (required),
  quantityInMl: Number (required),
  createdAt: Date (default: Date.now)
}
```

## 🍳 RasoiAI Recipe Data

The prototype uses a local JSON file (`data/recipes.json`) containing 10 popular Indian dishes with:
- Ingredients list
- Oil type and quantity used
- Cooking method
- Health tips

Recipes include: Dosa, Idli, Dal Tadka, Vegetable Curry, Chapati, Palak Paneer, Khichdi, Upma, Poha, and Chole.

## 🧪 Testing the Application

### 1. Register a New User
- Navigate to [http://localhost:3000/register](http://localhost:3000/register)
- Enter email and password
- Click "Create Account"

### 2. Log In
- Navigate to [http://localhost:3000/login](http://localhost:3000/login)
- Enter credentials
- Access the dashboard

### 3. Log a Meal
- Click "+ Log Meal" button
- Enter meal name, select oil type, and quantity
- Submit to track consumption

### 4. Search for Recipes
- Use the RasoiAI search box
- Search for dishes like "Dosa", "Dal Tadka", etc.
- View low-oil recipe suggestions

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth login

### Consumption Logs
- `POST /api/logs` - Create new log (protected)
- `GET /api/logs` - Get today's logs (protected)

### User Profile
- `GET /api/user` - Get user profile (protected)

### RasoiAI
- `GET /api/rasoiai/recipe?dishName=<dish>` - Search recipe (protected)

## 🎨 Styling

The application uses **Tailwind CSS** for styling with:
- Gradient backgrounds (green-50 to blue-50)
- Rounded corners and shadows for modern UI
- Responsive design (mobile-first approach)
- Custom color scheme (primary: green-600)

## 🔒 Security Best Practices

- Passwords hashed with bcryptjs
- Environment variables for sensitive data
- JWT-based sessions (httpOnly recommended for production)
- Input validation on both client and server
- MongoDB injection prevention via Mongoose

## 📈 Future Enhancements

- Real AI-powered recipe suggestions
- Weekly/monthly consumption analytics
- Social features (sharing progress)
- Integration with nutrition APIs
- Mobile app (React Native)
- Multi-language support
- Export data feature

## 🤝 Contributing

This is a prototype application. For contributions:
1. Fork the repository
2. Create a feature branch
3. Follow the layered architecture pattern
4. Submit a pull request

## 📄 License

This project is for educational/prototype purposes.

## 👥 Contact

For questions or feedback about MyHealthAI, please open an issue in the repository.

---

**Built with ❤️ for healthier cooking habits in India**
