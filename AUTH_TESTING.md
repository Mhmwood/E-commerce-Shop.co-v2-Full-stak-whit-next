# Authentication System Testing Guide

This guide will help you test all aspects of the NextAuth.js JWT authentication system with role-based access control.

## 🧪 Testing Setup

### 1. Environment Setup

First, ensure your environment variables are set:

```env
# .env.local
DATABASE_URL="your-database-url"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 2. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Start the development server
npm run dev
```

## 🔐 API Testing

### Test 1: User Registration

**Endpoint:** `POST /api/auth/signup`

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123!",
    "confirmPassword": "TestPass123!"
  }'
```

**Expected Response:**

```json
{
  "message": "User created successfully",
  "user": {
    "id": "user_id",
    "name": "Test User",
    "email": "test@example.com",
    "role": "USER",
    "image": null,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Test 2: Admin User Registration (Requires Admin Session)

**Endpoint:** `POST /api/auth/signup`

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=your-session-token" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "AdminPass123!",
    "confirmPassword": "AdminPass123!",
    "role": "ADMIN"
  }'
```

### Test 3: User Login

**Endpoint:** `POST /api/auth/signin` (NextAuth endpoint)

```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'
```

### Test 4: Get User Profile

**Endpoint:** `GET /api/auth/profile`

```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Cookie: next-auth.session-token=your-session-token"
```

**Expected Response:**

```json
{
  "id": "user_id",
  "name": "Test User",
  "email": "test@example.com",
  "role": "USER",
  "image": null,
  "emailVerified": null,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### Test 5: Update User Profile

**Endpoint:** `PATCH /api/auth/profile`

```bash
curl -X PATCH http://localhost:3000/api/auth/profile \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=your-session-token" \
  -d '{
    "name": "Updated Name",
    "email": "updated@example.com"
  }'
```

### Test 6: Change Password

**Endpoint:** `PUT /api/auth/profile`

```bash
curl -X PUT http://localhost:3000/api/auth/profile \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=your-session-token" \
  -d '{
    "currentPassword": "TestPass123!",
    "newPassword": "NewPass123!",
    "confirmNewPassword": "NewPass123!"
  }'
```

### Test 7: Admin User Management

**Get All Users:**

```bash
curl -X GET "http://localhost:3000/api/admin/users?page=1&limit=10" \
  -H "Cookie: next-auth.session-token=admin-session-token"
```

**Update User Role:**

```bash
curl -X PUT http://localhost:3000/api/auth/profile \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=admin-session-token" \
  -d '{
    "userId": "user_id",
    "role": "ADMIN"
  }'
```

**Delete User:**

```bash
curl -X DELETE "http://localhost:3000/api/admin/users?userId=user_id" \
  -H "Cookie: next-auth.session-token=admin-session-token"
```

## 🧪 Manual Testing Steps

### Step 1: Test User Registration

1. Open your browser to `http://localhost:3000`
2. Navigate to `/auth/signup` (if you have a signup page)
3. Fill in the registration form:
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "TestPass123!"
   - Confirm Password: "TestPass123!"
4. Submit the form
5. Check the response and verify user is created with USER role

### Step 2: Test User Login

1. Navigate to `/auth/signin`
2. Enter credentials:
   - Email: "test@example.com"
   - Password: "TestPass123!"
3. Submit the form
4. Verify you're redirected to the home page
5. Check that session is created

### Step 3: Test Protected Routes

1. Try to access `/admin` (should redirect to signin if not admin)
2. Try to access `/profile` (should work if authenticated)
3. Try to access `/cart` (should work if authenticated)

### Step 4: Test Role-Based Access

1. As a regular user, try to access `/admin` (should be denied)
2. Create an admin user (requires existing admin session)
3. Login as admin and verify access to admin routes

## 🧪 Component Testing

### Test Component: Auth Status

```tsx
// components/AuthStatus.tsx
"use client";

import { useAuth } from "@/lib/hooks/useAuth";

export function AuthStatus() {
  const { session, isAuthenticated, isLoading, userRole, isAdmin } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Not authenticated</div>;
  }

  return (
    <div>
      <h3>Authentication Status</h3>
      <p>Name: {session?.user?.name}</p>
      <p>Email: {session?.user?.email}</p>
      <p>Role: {userRole}</p>
      <p>Is Admin: {isAdmin ? "Yes" : "No"}</p>
    </div>
  );
}
```

### Test Component: Role-Based Content

```tsx
// components/RoleTest.tsx
"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { RoleBasedComponent, AdminOnlyComponent } from "@/lib/role-utils";

export function RoleTest() {
  const { userRole, isAdmin } = useAuth();

  return (
    <div>
      <h2>Role-Based Content Test</h2>

      {/* Content for all authenticated users */}
      <RoleBasedComponent userRole={userRole} requiredRole="USER">
        <div
          style={{
            padding: "10px",
            backgroundColor: "#e3f2fd",
            margin: "10px 0",
          }}
        >
          <h3>User Content</h3>
          <p>This content is visible to all authenticated users.</p>
        </div>
      </RoleBasedComponent>

      {/* Content only for admins */}
      <AdminOnlyComponent userRole={userRole}>
        <div
          style={{
            padding: "10px",
            backgroundColor: "#ffebee",
            margin: "10px 0",
          }}
        >
          <h3>Admin Content</h3>
          <p>This content is only visible to administrators.</p>
        </div>
      </AdminOnlyComponent>

      {/* Fallback for non-admin users */}
      <AdminOnlyComponent
        userRole={userRole}
        fallback={
          <div
            style={{
              padding: "10px",
              backgroundColor: "#fff3e0",
              margin: "10px 0",
            }}
          >
            <p>You need admin privileges to view this content.</p>
          </div>
        }
      >
        <div>Secret admin content</div>
      </AdminOnlyComponent>
    </div>
  );
}
```

### Test Component: Auth Actions

```tsx
// components/AuthActions.tsx
"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useState } from "react";

export function AuthActions() {
  const {
    login,
    register,
    logout,
    updateUserProfile,
    changeUserPassword,
    error,
    loading,
  } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login({
      email: formData.email,
      password: formData.password,
    });
    console.log("Login result:", result);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    });
    console.log("Register result:", result);
  };

  const handleLogout = async () => {
    const result = await logout();
    console.log("Logout result:", result);
  };

  return (
    <div>
      <h2>Authentication Actions</h2>

      {error && <div style={{ color: "red", margin: "10px 0" }}>{error}</div>}
      {loading && <div>Loading...</div>}

      {/* Login Form */}
      <form onSubmit={handleLogin} style={{ margin: "20px 0" }}>
        <h3>Login</h3>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <button type="submit">Login</button>
      </form>

      {/* Register Form */}
      <form onSubmit={handleRegister} style={{ margin: "20px 0" }}>
        <h3>Register</h3>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
        />
        <button type="submit">Register</button>
      </form>

      {/* Logout Button */}
      <button onClick={handleLogout} style={{ margin: "20px 0" }}>
        Logout
      </button>
    </div>
  );
}
```

## 🧪 Test Page

Create a test page to combine all components:

```tsx
// app/test-auth/page.tsx
import { AuthStatus } from "@/components/AuthStatus";
import { RoleTest } from "@/components/RoleTest";
import { AuthActions } from "@/components/AuthActions";

export default function TestAuthPage() {
  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Authentication System Test</h1>

      <AuthStatus />
      <hr />
      <AuthActions />
      <hr />
      <RoleTest />
    </div>
  );
}
```

## 🧪 Validation Testing

### Test Password Requirements

Try these invalid passwords and verify they're rejected:

```bash
# Too short
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test2@example.com",
    "password": "short",
    "confirmPassword": "short"
  }'

# No uppercase
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test3@example.com",
    "password": "password123!",
    "confirmPassword": "password123!"
  }'

# No special character
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test4@example.com",
    "password": "Password123",
    "confirmPassword": "Password123"
  }'
```

### Test Email Validation

```bash
# Invalid email
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "invalid-email",
    "password": "TestPass123!",
    "confirmPassword": "TestPass123!"
  }'
```

## 🧪 Error Testing

### Test Unauthorized Access

```bash
# Try to access protected endpoint without authentication
curl -X GET http://localhost:3000/api/auth/profile

# Try to access admin endpoint as regular user
curl -X GET http://localhost:3000/api/admin/users \
  -H "Cookie: next-auth.session-token=user-session-token"
```

### Test Duplicate Registration

```bash
# Register the same email twice
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "duplicate@example.com",
    "password": "TestPass123!",
    "confirmPassword": "TestPass123!"
  }'

# Try again with same email
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User 2",
    "email": "duplicate@example.com",
    "password": "TestPass123!",
    "confirmPassword": "TestPass123!"
  }'
```

## 🧪 Browser Testing

### Test Session Persistence

1. Login to the application
2. Close the browser
3. Reopen and navigate to the app
4. Verify you're still logged in
5. Check that the session persists

### Test Route Protection

1. Login as a regular user
2. Try to access `/admin` in the browser
3. Verify you're redirected to home page
4. Login as admin user
5. Verify you can access `/admin`

### Test Logout

1. Login to the application
2. Click logout
3. Verify you're redirected to home page
4. Try to access protected routes
5. Verify you're redirected to login

## 🧪 Database Testing

### Check User Records

```sql
-- Check users table
SELECT id, name, email, role, "createdAt" FROM "User";

-- Check sessions table
SELECT * FROM "Session";

-- Check accounts table (if using OAuth)
SELECT * FROM "Account";
```

### Verify Role Assignment

```sql
-- Check user roles
SELECT name, email, role FROM "User" ORDER BY "createdAt" DESC;
```

## 🧪 Performance Testing

### Test Concurrent Logins

```bash
# Run multiple login requests simultaneously
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/auth/signin \
    -H "Content-Type: application/json" \
    -d '{"email": "test@example.com", "password": "TestPass123!"}' &
done
wait
```

## 🧪 Security Testing

### Test JWT Token

1. Login and get the session token
2. Decode the JWT token (using jwt.io)
3. Verify the token contains user information
4. Verify the token has proper expiration

### Test Password Hashing

```sql
-- Check that passwords are hashed
SELECT name, email, password FROM "User";
-- Passwords should be long hashed strings, not plain text
```

## 🧪 Integration Testing

### Test Complete User Flow

1. Register a new user
2. Login with the new user
3. Update profile information
4. Change password
5. Logout
6. Login with new password
7. Verify all changes are persisted

### Test Admin Flow

1. Create an admin user (requires existing admin session)
2. Login as admin
3. Access admin-only routes
4. Manage other users
5. Update user roles
6. Delete users

## 🧪 Troubleshooting

### Common Issues

1. **"Invalid credentials" error**: Check if user exists and password is correct
2. **"User already exists" error**: Email is already registered
3. **"Access denied" error**: User doesn't have required role
4. **Session not persisting**: Check NEXTAUTH_SECRET and NEXTAUTH_URL
5. **Database connection errors**: Verify DATABASE_URL is correct

### Debug Mode

Enable debug mode in development:

```tsx
// In lib/auth.ts
debug: process.env.NODE_ENV === "development",
```

This will provide detailed logs for authentication issues.

## 🧪 Automated Testing

For automated testing, consider using tools like:

- **Jest** for unit testing
- **Playwright** for end-to-end testing
- **Supertest** for API testing
- **Cypress** for browser testing

Example Jest test:

```tsx
// __tests__/auth.test.ts
import { SignUpSchema } from "@/validations/authSchema";

describe("Auth Validation", () => {
  test("should validate correct signup data", () => {
    const validData = {
      name: "Test User",
      email: "test@example.com",
      password: "TestPass123!",
      confirmPassword: "TestPass123!",
    };

    const result = SignUpSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  test("should reject invalid password", () => {
    const invalidData = {
      name: "Test User",
      email: "test@example.com",
      password: "weak",
      confirmPassword: "weak",
    };

    const result = SignUpSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
```

This comprehensive testing guide will help you verify that your authentication system is working correctly across all scenarios!
