# FundOS Web Application - Development Context & Guidelines

## 🏗️ **Current Project State**

This is a **React TypeScript web application** for FundOS - a financial investment platform with modular architecture supporting **Admin** and **Subadmin** portals with consistent design patterns.

### **Technology Stack**
- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS 4.x with custom CSS variables
- **UI Components**: Radix UI primitives with custom design system
- **Routing**: React Router v7
- **Forms**: React Hook Form with validation
- **State Management**: React Query for server state
- **Animations**: Framer Motion for smooth transitions
- **Notifications**: Custom notification system (replaced react-hot-toast)

## 🎨 **Design System & UI Guidelines**

### **Color Scheme & Theming**
```css
/* Primary Brand Colors */
--fundos-blue-primary: #4F9CF9    /* Main brand blue */
--fundos-blue-secondary: #5C85F4   /* Secondary blue */
--fundos-blue-light: #E6F3FF       /* Light blue backgrounds */
--fundos-blue-dark: #2563EB        /* Dark blue accents */

/* Neutral Palette */
--fundos-neutral-50 to 900         /* Complete neutral scale */

/* Semantic Colors */
--fundos-success: #22C55E          /* Green for success states */
--fundos-warning: #F59E0B          /* Amber for warnings */
--fundos-error: #EF4444            /* Red for errors */
```

### **Layout Patterns**
- **Desktop (1024px+)**: Two-card layout with info panel left, content right
- **Mobile (< 1024px)**: Single column, mobile-first responsive design
- **Containers**: `.fundos-container` with responsive max-widths
- **Cards**: `.fundos-card` and `.fundos-card-elevated` for depth

### **Portal-Specific Themes**
- **Admin Portal**: Light theme with blue gradients, professional appearance
- **Subadmin Portal**: Dark theme with gray/slate backgrounds, modern feel
- **Auto-detection**: Based on hostname/pathname for theme switching

## 🧩 **Component Architecture**

### **Modular Component Structure**
```
src/components/
├── ui/                    # Basic UI primitives (shadcn-style)
├── custom/               # Business logic components
│   ├── Layout.tsx       # Main layout wrapper
│   ├── ErrorAlert.tsx   # Inline error display
│   ├── Notification.tsx # Toast-style notifications
│   ├── NotificationProvider.tsx # Global notification context
│   └── [Feature]Section/ # Feature-grouped components
```

### **Key Custom Components**
1. **ErrorAlert**: Reusable error display with variants (error/warning/info)
2. **Notification System**: Modern glassmorphism notifications with theme awareness
3. **NotificationProvider**: Global notification context with convenience methods
4. **LoadingSpinner**: Consistent loading states

## 🔄 **State Management Patterns**

### **API Error Handling**
```typescript
// All API functions return standardized format:
{ success: boolean; message?: string; data?: any }

// Error extraction priority:
error.response?.data?.detail || error.response?.data?.message || fallback
```

### **Notification Usage**
```typescript
const notification = useNotification();

// Use throughout app for consistent messaging
notification.success('Title', 'Description', { duration: 5000 });
notification.error('Error occurred', 'Detailed message');
```

## 🎯 **Current Implementation Status**

### ✅ **Completed Features**
1. **Login System**: 
   - Two-card responsive layout (desktop/mobile)
   - Admin/Subadmin role-based routing
   - Modern form validation with react-hook-form
   - Enhanced error handling with specific API messages

2. **Password Reset Flow**:
   - Multi-step process (Email → OTP → New Password)
   - Real-time validation and error display
   - Specific error messages from API detail field
   - Progress indicators and loading states

3. **Notification System**:
   - Custom notification component replacing react-hot-toast
   - Theme-aware styling (light/dark modes)
   - Glassmorphism effects with backdrop blur
   - Smooth animations and progress bars

4. **Error Handling**:
   - Comprehensive API error extraction
   - User-friendly error message formatting
   - Context-aware error display (inline + notifications)
   - Graceful error recovery patterns

5. **Responsive Design**:
   - Mobile-first approach with breakpoint system
   - Consistent spacing and typography scales
   - Touch-friendly interface elements
   - Cross-device testing and optimization

### 🔧 **Established Patterns to Follow**

#### **File Naming & Organization**
- **Pages**: PascalCase (e.g., `SignIn.tsx`, `AdminDashboard.tsx`)
- **Components**: PascalCase with feature grouping
- **Utilities**: camelCase (e.g., `errorUtils.ts`, `formatUtils.ts`)
- **Constants**: camelCase with descriptive names

#### **CSS Methodology**
- **Custom Classes**: Prefix with `fundos-` for component-specific styles
- **Utility Classes**: Use Tailwind utilities for spacing, colors, layout
- **Responsive**: Mobile-first with `sm:`, `md:`, `lg:`, `xl:` prefixes
- **Animations**: Framer Motion for complex animations, CSS for simple transitions

#### **TypeScript Patterns**
- **Strict Typing**: All props, API responses, and state properly typed
- **Interface Naming**: Descriptive interfaces (e.g., `NotificationConfig`)
- **Generic Types**: Use for reusable components and utilities
- **Error Handling**: Proper error type guards and fallbacks

#### **API Integration**
- **Axios Configuration**: Centralized in `axiosConfig.ts`
- **Error Handling**: Consistent error extraction and user feedback
- **Loading States**: Proper loading indicators for all async operations
- **Success Feedback**: Notifications for positive user actions

## 🚀 **Development Guidelines**

### **Adding New Features**
1. **Follow Existing Patterns**: Use established component structures and naming
2. **Responsive First**: Implement mobile-first, then enhance for desktop
3. **Error Handling**: Include comprehensive error states and user feedback
4. **Accessibility**: Ensure keyboard navigation and screen reader support
5. **Theme Consistency**: Respect admin/subadmin theme differences

### **Code Quality Standards**
- **ESLint/Prettier**: Maintain consistent code formatting
- **Type Safety**: No `any` types, proper error handling
- **Component Reusability**: Extract common patterns into reusable components
- **Performance**: Optimize re-renders and bundle size

### **Testing Approach**
- **Manual Testing**: Cross-browser and device testing
- **Error Scenarios**: Test all error states and edge cases
- **User Flows**: Complete end-to-end user journey testing
- **Responsive Testing**: All breakpoints and orientations

## 📁 **Project Structure Overview**
```
src/
├── components/          # Reusable UI components
├── pages/              # Route-level components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and helpers
├── constants/          # App constants and enums
├── axioscalls/         # API service functions
├── utils/              # General utility functions
└── types/              # TypeScript type definitions
```

## 🎯 **Next Development Priorities**

### **Immediate Tasks**
1. Fix subadmin login page refresh issue on incorrect password
2. Extend notification system to all user interactions
3. Implement consistent loading states across all forms
4. Add proper error boundaries for error recovery

### **Feature Development**
1. Dashboard implementations for admin/subadmin
2. Data tables with sorting, filtering, pagination
3. Form components following established patterns
4. Modal/dialog systems with consistent styling

### **Performance & UX**
1. Lazy loading for route components
2. Optimistic UI updates for better perceived performance
3. Offline state handling and recovery
4. Progressive web app features

---

## 💡 **Key Instructions for Continuation**

When continuing development on this project:

1. **Maintain Design Consistency**: Always use the established color palette, spacing, and component patterns
2. **Follow TypeScript Standards**: Properly type all props, state, and API responses
3. **Use Existing Components**: Leverage ErrorAlert, Notification system, and other established components
4. **Responsive Design**: Always implement mobile-first with proper breakpoint usage
5. **Error Handling**: Use the established error message formatting and display patterns
6. **Code Organization**: Follow the existing folder structure and naming conventions
7. **API Integration**: Use the established error handling patterns and notification system
8. **Theme Awareness**: Respect admin (light) vs subadmin (dark) theme differences

The codebase is well-structured with consistent patterns - follow these guidelines to maintain code quality and user experience standards.
