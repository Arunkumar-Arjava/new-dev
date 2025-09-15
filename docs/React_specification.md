<!-- 1. Overview of app -->

1. Overview

        App Type: React (Vite)

        UI Library: shadcn/ui

        Styling: Tailwind CSS + consistent custom color palette

        Primary Goal: A simple, modern AI-powered web app with clean UI and reusable componponent


<!-- Tech stack -->
2. Tech Stack

        Frontend: React 19.1.1

        UI Components: shadcn/ui (Button, Input, Card, Dialog, Tabs, etc.)

        Styling: TailwindCSS 

        State Management: React hooks (useState, useEffect, useContext , etc.)

Environment Config:

        .env.dev → Beeceptor mock API endpoint

        .env.prod → AWS API endpoint


<!-- environment specification -->

3. Environment Files

        .env.dev (Beeceptor mock)

        VITE_API_URL=https://arjava.proxy.beeceptor.com
        VITE_ENV=development


        .env.prod (AWS API)

        VITE_API_URL=https://your-aws-api-url.amazonaws.com
        VITE_ENV=production


App should auto-select env file depending on build command (npm run dev vs npm run build).


<!-- colour specification -->

4. Color Palette (Blue & White)
// tailwind.config.js extend
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: "#002e4d", // Blue-600
        foreground: "#FFFFFF",
      },
      secondary: {
        DEFAULT: "#002e4d", // Blue-500
        foreground: "#FFFFFF",
      },
      background: "#FFFFFF",   // White background
      foreground: "#111827",   // Dark gray text
      muted: "#E5E7EB",        // Light gray
    },
  },
}


<!-- component specificatio -->

🔑 Design & Style Guidelines

1.Consistent Style

        The blue & white color palette must be applied throughout the app.

        No mixing of external UI styles or random colors.

        All interactive elements (buttons, inputs, dialogs) should match the theme.

2.hadcn/ui First

        Always use shadcn/ui components (Button, Input, Card, Dialog, Tabs, Alert, etc.).

        Do not create raw HTML elements unless absolutely necessary.

        Extend shadcn/ui components if customization is needed, instead of building new ones from scratch.

3.Uniform Components Across the App

        If a <Card /> is used for AI responses, the same <Card /> style must be used for history items, settings previews, etc.

        If <Button /> is styled as variant="default" (blue), all primary buttons across the app should use this variant.

        Inputs must use <Input /> from shadcn/ui consistently (for chat box, settings form, API key input).

4.Reusable Design Tokens

        Define theme colors (blue & white) in tailwind.config.js.

        Reference those tokens everywhere (bg-primary, text-primary-foreground, etc.) instead of hardcoding hex codes.

5.Global Layout

        Use a grid/flex layout with consistent spacing (p-4, rounded-2xl, shadow-md).

        Ensure all pages feel like part of a single design system.




<!-- Responsiveness & Layout Guidelines -->
Responsiveness & Layout Guidelines 


1.Mobile-First Design

        All pages must be designed mobile-first (small screens first, then scale up).

        On mobile: use stacked layout (cards full width, sidebar collapses into drawer).

2.Responsive Breakpoints

        Follow Tailwind’s default breakpoints (sm, md, lg, xl).

        Components should gracefully resize, stack, or reflow at each breakpoint.

3.Flexible Layouts

        Use flex and grid from Tailwind for layouts (avoid fixed pixel widths).

        Chat input should stick to bottom of screen on mobile.

        History panel should be a collapsible drawer on small screens, and a sidebar on larger screens.

4.Consistent Responsiveness

        The same shadcn/ui components should scale naturally across all pages.

        Example:

        <Card /> → full width on mobile, max-w-md on desktop.

        <Button /> → always readable, never cut off.

        <Tabs /> → collapse into <Accordion /> on very small screens if needed.

5.Testing Requirement

        Each page must be verified on:

        Mobile (≤640px)

        Tablet (641–1024px)

        Desktop (≥1025px)

        No overflow, text cut-off, or misaligned buttons allowed.



<!-- file structure -->

src/
 ├── App.jsx
 ├── main.jsx
 ├── components/
 │    ├── adminFlow/
 │    │     ├── Dashboard.jsx
 │    │     ├── ManageUsers.jsx
 │    │     └── Reports.jsx
 │    │
 │    ├── parentFlow/
 │    │     ├── Dashboard.jsx
 │    │     ├── StudentDetails.jsx
 │    │     └── Fees.jsx
 │    │
 │    ├── authentication/
 │    │     ├── Login.jsx
 │    │     ├── Register.jsx
 │    │     └── ForgotPassword.jsx
 │    │
 │    └── SelectSchool.jsx
 │
 ├── context/
 ├── lib/       # API utils (Beeceptor & AWS)



<!-- routing -->
Routing

        Use react-router-dom for navigation.

        Public routes: Login, Register, ForgotPassword, SelectSchool.

        Protected routes: AdminFlow/*, ParentFlow/*.

        Redirect unauthenticated users to Login.