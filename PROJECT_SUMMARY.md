# MyHealthAI - Project Summary

## 📋 Overview

MyHealthAI is a full-stack web application prototype designed to help Indian users track and reduce their daily edible oil consumption. The application follows modern system design principles with a clear layered architecture.

## 🏗️ Architecture Overview

### Three-Tier Layered Architecture

```
┌─────────────────────────────────────────────┐
│     PRESENTATION LAYER (UI)                 │
│  - Pages (Login, Register, Dashboard)       │
│  - Components (Modals, Charts, Search)      │
│  - Client-side State Management             │
└─────────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────────┐
│  APPLICATION LAYER (Business Logic/API)     │
│  - Authentication (NextAuth.js)             │
│  - API Routes (Logs, User, Recipes)         │
│  - Request Validation & Authorization       │
└─────────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────────┐
│      DATA LAYER (Database)                  │
│  - MongoDB Connection (with caching)        │
│  - Mongoose Models (User, ConsumptionLog)   │
│  - Data Validation & Relationships          │
└─────────────────────────────────────────────┘
```

## 📁 Complete File Structure

```
myhealthai/
├── app/
│   ├── api/                           # APPLICATION LAYER
│   │   ├── auth/
│   │   │   ├── [...nextauth]/
│   │   │   │   └── route.ts          # NextAuth configuration & handlers
│   │   │   └── register/
│   │   │       └── route.ts          # User registration endpoint
│   │   ├── logs/
│   │   │   └── route.ts              # Create/Read consumption logs
│   │   ├── rasoiai/
│   │   │   └── recipe/
│   │   │       └── route.ts          # Recipe search (reads JSON)
│   │   └── user/
│   │       └── route.ts              # User profile endpoint
│   ├── dashboard/
│   │   └── page.tsx                  # Protected dashboard page
│   ├── login/
│   │   └── page.tsx                  # Login form
│   ├── register/
│   │   └── page.tsx                  # Registration form
│   ├── layout.tsx                    # Root layout with providers
│   ├── page.tsx                      # Landing page
│   └── globals.css                   # Global styles + animations
├── components/                        # PRESENTATION LAYER
│   ├── LogMealModal.tsx              # Modal for logging meals
│   ├── ProgressCircle.tsx            # Circular progress indicator
│   ├── Providers.tsx                 # SessionProvider wrapper
│   └── RasoiAISearch.tsx             # Recipe search interface
├── data/
│   └── recipes.json                  # 10 low-oil Indian recipes
├── lib/                               # DATA LAYER
│   └── mongodb.ts                    # MongoDB connection with caching
├── models/                            # DATA LAYER
│   ├── log.model.ts                  # ConsumptionLog Mongoose schema
│   └── user.model.ts                 # User Mongoose schema
├── types/
│   └── next-auth.d.ts                # NextAuth type extensions
├── middleware.ts                     # Route protection middleware
├── .env.local                        # Environment variables (not committed)
├── .env.example                      # Example env variables
├── .gitignore                        # Git ignore rules
├── package.json                      # Dependencies & scripts
├── tsconfig.json                     # TypeScript configuration
├── next.config.ts                    # Next.js configuration
├── tailwind.config.ts                # Tailwind CSS config
├── README.md                         # Main documentation
└── SETUP.md                          # Quick setup guide
```

## 🎯 Key Features Implemented

### 1. User Authentication
- ✅ Email/password registration with validation
- ✅ Secure password hashing (bcryptjs, 10 salt rounds)
- ✅ JWT-based session management (NextAuth.js v5)
- ✅ Protected routes (middleware)
- ✅ Login/logout functionality

### 2. Oil Consumption Tracking
- ✅ Log meals with name, oil type, and quantity
- ✅ Fetch today's consumption logs
- ✅ Real-time calculation of total oil used
- ✅ Visual progress indicator (circular chart)
- ✅ Percentage display against daily goal

### 3. User Profile Management
- ✅ Default daily oil goal (30ml)
- ✅ Points system (1 point per log entry)
- ✅ Profile data API endpoint
- ✅ Display user email and points

### 4. RasoiAI Recipe Search
- ✅ Local JSON database with 10 recipes
- ✅ Case-insensitive search
- ✅ Display ingredients, oil quantity, cooking method
- ✅ Health tips for each recipe
- ✅ Culturally relevant Indian dishes

### 5. UI/UX Features
- ✅ Responsive design (mobile-first)
- ✅ Modern gradient backgrounds
- ✅ Modal dialogs for actions
- ✅ Loading states
- ✅ Error handling & display
- ✅ Smooth animations
- ✅ Tailwind CSS utility classes

## 🛠️ Technology Stack Details

### Frontend
- **Framework**: Next.js 15.5.6 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI State**: React Hooks (useState, useEffect)
- **Session**: next-auth/react

### Backend (API)
- **Runtime**: Node.js
- **API**: Next.js API Routes (App Router)
- **Authentication**: NextAuth.js v5 (beta)
- **Validation**: Manual + Mongoose validators

### Database
- **Database**: MongoDB
- **ODM**: Mongoose 8.x
- **Connection**: Cached connection pattern
- **Schema**: Strong typing with TypeScript

### Security
- **Password Hashing**: bcryptjs
- **Session**: JWT (configurable)
- **Environment**: dotenv (.env.local)
- **Validation**: Input sanitization

## 📊 Data Models

### User Model
```typescript
interface IUser {
  _id?: ObjectId;
  email: string;           // Unique, required, validated
  password: string;        // Hashed with bcryptjs
  dailyOilGoal: number;   // Default: 30ml
  points: number;          // Default: 0, increments per log
  createdAt?: Date;
  updatedAt?: Date;
}
```

### ConsumptionLog Model
```typescript
interface IConsumptionLog {
  _id?: ObjectId;
  userId: ObjectId;        // Reference to User
  mealName: string;        // e.g., "Lunch - Dal Tadka"
  oilType: string;         // e.g., "Sunflower Oil"
  quantityInMl: number;    // e.g., 15
  createdAt?: Date;        // Auto-generated
}
```

### Recipe Data Structure
```typescript
interface Recipe {
  dishName: string;
  ingredients: string[];
  oilUsed: string;
  quantityInMl: number;
  cookingMethod: string;
  healthTips: string;
}
```

## 🔐 Authentication Flow

```
User Registration:
1. User enters email/password → POST /api/auth/register
2. Server validates input (email format, password length)
3. Server checks if user exists
4. Password hashed with bcryptjs (10 rounds)
5. User document created in MongoDB
6. Success response sent → Redirect to /login

User Login:
1. User enters credentials → POST /api/auth/[...nextauth]
2. NextAuth Credentials Provider validates
3. Server finds user by email
4. bcrypt.compare verifies password
5. JWT token generated with user ID
6. Session stored (JWT strategy)
7. Redirect to /dashboard

Protected Route Access:
1. Request to /dashboard
2. Middleware checks session (auth function)
3. If no session → Redirect to /login
4. If valid session → Allow access
5. User data available in session.user
```

## 🌊 Data Flow Examples

### Logging a Meal
```
User Action (Frontend):
1. Click "+ Log Meal" button
2. Fill modal form (meal, oil type, quantity)
3. Submit → POST /api/logs

API Processing:
4. Verify user session (unauthorized if not logged in)
5. Validate input (required fields, positive quantity)
6. Create ConsumptionLog document in MongoDB
7. Increment user points by 1
8. Return success response

UI Update:
9. Close modal
10. Refresh dashboard data (fetchData)
11. Update progress circle
12. Display new log in "Today's Meals" list
```

### Searching for a Recipe
```
User Action:
1. Enter dish name in RasoiAI search box
2. Submit → GET /api/rasoiai/recipe?dishName=Dosa

API Processing:
3. Verify user session
4. Read data/recipes.json file
5. Parse JSON to array
6. Case-insensitive search for matching dish
7. Return recipe or 404 error

UI Display:
8. Display recipe card with:
   - Dish name
   - Ingredients list
   - Oil type and quantity
   - Cooking method
   - Health tips
```

## 🎨 Design Patterns Used

### 1. Layered Architecture
- Clear separation of concerns
- Each layer has specific responsibilities
- Loose coupling between layers

### 2. Repository Pattern
- Mongoose models abstract database operations
- Consistent data access interface

### 3. Provider Pattern
- SessionProvider wraps application
- Context available throughout component tree

### 4. Composition Pattern
- Reusable components (ProgressCircle, Modal)
- Components composed into pages

### 5. Singleton Pattern
- MongoDB connection cached globally
- Prevents connection pool exhaustion

## 📈 Performance Considerations

### 1. MongoDB Connection Caching
```typescript
// Reuses existing connection in serverless environment
let cached = global.mongoose || { conn: null, promise: null };
```

### 2. Indexed Queries
```typescript
// Compound index for efficient log queries
ConsumptionLogSchema.index({ userId: 1, createdAt: -1 });
```

### 3. Client-Side Data Fetching
```typescript
// Parallel API calls for faster loading
const [logsResponse, userResponse] = await Promise.all([...]);
```

### 4. Optimistic UI Updates
- Modal closes immediately after submission
- Data refetches in background

## 🔒 Security Measures

1. **Password Security**: bcryptjs with 10 salt rounds
2. **Environment Variables**: Sensitive data in .env.local
3. **Input Validation**: Client + server-side
4. **Session Management**: JWT tokens (httpOnly recommended)
5. **Route Protection**: Middleware guards protected pages
6. **MongoDB Injection**: Mongoose query sanitization

## 🚀 Deployment Checklist

- [ ] Set production MONGODB_URI
- [ ] Generate strong NEXTAUTH_SECRET
- [ ] Set NEXTAUTH_URL to production domain
- [ ] Enable httpOnly cookies for JWT
- [ ] Set up MongoDB Atlas IP whitelist
- [ ] Configure CORS if needed
- [ ] Enable rate limiting (future)
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Configure CI/CD pipeline
- [ ] Run production build test

## 📝 API Endpoints Summary

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/register` | POST | No | Create new user |
| `/api/auth/[...nextauth]` | POST | No | Login (NextAuth) |
| `/api/logs` | POST | Yes | Create consumption log |
| `/api/logs` | GET | Yes | Get today's logs |
| `/api/user` | GET | Yes | Get user profile |
| `/api/rasoiai/recipe` | GET | Yes | Search recipe by name |

## 🎓 Learning Resources

- **Next.js App Router**: [nextjs.org/docs](https://nextjs.org/docs)
- **NextAuth.js v5**: [authjs.dev](https://authjs.dev/)
- **Mongoose**: [mongoosejs.com](https://mongoosejs.com/)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com/)
- **TypeScript**: [typescriptlang.org](https://www.typescriptlang.org/)

## 🔮 Future Enhancements

### Short-term
- [ ] Edit/delete logs functionality
- [ ] User profile editing page
- [ ] Weekly/monthly consumption charts
- [ ] Export data to CSV
- [ ] Email notifications

### Long-term
- [ ] Real AI-powered recipe suggestions (OpenAI API)
- [ ] Social features (share progress, leaderboards)
- [ ] Mobile app (React Native)
- [ ] Barcode scanning for packaged foods
- [ ] Integration with nutrition APIs
- [ ] Multi-language support (Hindi, Tamil, etc.)
- [ ] Doctor recommendations based on consumption

## 📞 Support & Contact

For questions, issues, or contributions:
- Review README.md for detailed documentation
- Check SETUP.md for installation help
- Open GitHub issues for bugs
- Submit pull requests for features

---

**Built with ❤️ for healthier India**

*Version 1.0.0 - Prototype*
