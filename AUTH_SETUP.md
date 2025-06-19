# NextAuth.js JWT Authentication Setup

This project includes a complete JWT-based authentication system using NextAuth.js with the following features:

## 🚀 Features

- ✅ **JWT-based authentication** with NextAuth.js
- ✅ **User registration and login** with email/password
- ✅ **Password hashing** with bcryptjs
- ✅ **Input validation** with Zod schemas
- ✅ **Protected routes** with middleware
- ✅ **User profile management**
- ✅ **Password change functionality**
- ✅ **Session management**
- ✅ **TypeScript support**

## 📁 File Structure

```
├── app/
│   ├── api/auth/
│   │   ├── [...nextauth]/route.ts    # NextAuth API handler
│   │   ├── signup/route.ts           # User registration
│   │   └── profile/route.ts          # Profile management
│   ├── providers.tsx                 # SessionProvider wrapper
│   └── layout.tsx                    # Root layout with providers
├── lib/
│   ├── auth.ts                       # NextAuth configuration
│   ├── auth-utils.ts                 # Client-side auth utilities
│   └── hooks/
│       └── useAuth.ts                # Custom auth hook
├── validations/
│   └── authSchema.ts                 # Authentication validation schemas
├── middlewares/
│   └── auth.ts                       # Route protection middleware
└── prisma/
    └── schema.prisma                 # Database schema with auth tables
```

## 🔧 Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in your project root:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/your_database"

# NextAuth
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# JWT (optional - NextAuth will generate one if not provided)
JWT_SECRET="your-jwt-secret-key"
```

### 2. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) Run migrations
npm run db:migrate
```

### 3. Generate NEXTAUTH_SECRET

```bash
# Generate a secure secret
openssl rand -base64 32
```

## 🔐 API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth endpoints (signin, signout, etc.)

### User Management

- `GET /api/auth/profile` - Get user profile
- `PATCH /api/auth/profile` - Update user profile
- `PUT /api/auth/profile` - Change password

## 🎣 Usage Examples

### Client-Side Authentication

```tsx
import { useAuth } from "@/lib/hooks/useAuth";

function LoginForm() {
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login({
      email: "user@example.com",
      password: "password123",
    });

    if (result.success) {
      // Redirect or show success message
    }
  };

  return <form onSubmit={handleSubmit}>{/* Your form fields */}</form>;
}
```

### Server-Side Authentication

```tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function ProtectedPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return <div>Welcome {session.user.name}!</div>;
}
```

### Route Protection

```tsx
// This is automatically handled by middleware
// Routes under /cart, /checkout, /profile, /orders are protected
```

## 🔒 Security Features

- **Password Requirements**: Minimum 8 characters with uppercase, lowercase, number, and special character
- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: bcryptjs with salt rounds of 12
- **Input Validation**: Comprehensive Zod schemas
- **Route Protection**: Middleware-based route protection
- **Session Management**: Automatic session handling

## 📝 Validation Rules

### Sign Up

- **Name**: 2-50 characters, letters and spaces only
- **Email**: Valid email format, 1-100 characters
- **Password**: 8-100 characters, must include uppercase, lowercase, number, and special character
- **Confirm Password**: Must match password

### Sign In

- **Email**: Valid email format, required
- **Password**: Required

### Profile Update

- **Name**: 2-50 characters, letters and spaces only (optional)
- **Email**: Valid email format, 1-100 characters (optional)
- **Image**: Valid URL (optional)

## 🛠️ Customization

### Adding New Providers

```tsx
// In lib/auth.ts
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      /* ... */
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  // ... rest of config
};
```

### Custom Callbacks

```tsx
// In lib/auth.ts
callbacks: {
  async jwt({ token, user }) {
    // Add custom logic here
    return token;
  },
  async session({ session, token }) {
    // Add custom logic here
    return session;
  },
}
```

## 🚨 Error Handling

The system includes comprehensive error handling:

- **Validation Errors**: Detailed field-specific error messages
- **Authentication Errors**: Clear login/registration error messages
- **Database Errors**: Proper error responses for database operations
- **Network Errors**: Graceful handling of network issues

## 📱 Client-Side Hooks

### useAuth Hook

```tsx
const {
  session, // Current session data
  isAuthenticated, // Boolean authentication status
  isLoading, // Loading state
  loading, // Action loading state
  error, // Error message
  login, // Sign in function
  register, // Sign up function
  logout, // Sign out function
  updateUserProfile, // Update profile function
  changeUserPassword, // Change password function
  getUserProfileData, // Get profile function
  clearError, // Clear error function
} = useAuth();
```

## 🔄 Session Management

- **Automatic Session Handling**: NextAuth manages sessions automatically
- **JWT Strategy**: Uses JWT tokens for stateless authentication
- **Session Expiry**: 30-day session duration
- **Auto-refresh**: Sessions are automatically refreshed

## 🎯 Best Practices

1. **Always validate input** using the provided schemas
2. **Use the useAuth hook** for client-side authentication
3. **Protect sensitive routes** using middleware
4. **Handle loading states** in your UI
5. **Provide clear error messages** to users
6. **Use HTTPS in production** for secure token transmission

## 🐛 Troubleshooting

### Common Issues

1. **"Invalid credentials" error**: Check if user exists and password is correct
2. **"User already exists" error**: Email is already registered
3. **"Unauthorized" error**: User is not authenticated
4. **Session not persisting**: Check NEXTAUTH_SECRET and NEXTAUTH_URL

### Debug Mode

Enable debug mode in development:

```tsx
// In lib/auth.ts
debug: process.env.NODE_ENV === "development",
```

This will provide detailed logs for authentication issues.
