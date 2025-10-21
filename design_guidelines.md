# ReelBoost Design Guidelines

## Design Approach
**Selected Framework:** Modern Dashboard System inspired by Linear and Notion  
**Rationale:** As a utility-focused SMM panel with complex data workflows, efficiency and clarity take precedence over decorative elements. The design emphasizes professional credibility, clear information hierarchy, and streamlined task completion.

**Core Principles:**
- Data clarity over visual flourish
- Consistent, predictable patterns for efficiency
- Professional trust-building through clean aesthetics
- Mobile-responsive dashboard layouts

---

## Color Palette

### Light Mode
- **Primary Brand:** 239 84% 67% (vibrant purple-blue for CTAs and key actions)
- **Background:** 0 0% 100% (pure white)
- **Surface:** 240 5% 96% (subtle gray for cards)
- **Border:** 240 6% 90% (soft borders)
- **Text Primary:** 240 10% 4% (near-black)
- **Text Secondary:** 240 4% 46% (medium gray)
- **Success:** 142 76% 36% (wallet/completed orders)
- **Warning:** 38 92% 50% (pending status)
- **Error:** 0 84% 60% (failed orders/refunds)

### Dark Mode
- **Primary Brand:** 239 84% 67% (consistent with light)
- **Background:** 240 10% 4% (deep dark)
- **Surface:** 240 6% 10% (elevated cards)
- **Border:** 240 4% 16% (subtle borders)
- **Text Primary:** 0 0% 98% (near-white)
- **Text Secondary:** 240 5% 65% (muted text)

---

## Typography

**Font System:** Inter (Google Fonts)
- **Display/Hero:** 600 weight, 36-48px (dashboard headers)
- **H1:** 600 weight, 30-36px (page titles)
- **H2:** 600 weight, 24px (section headers)
- **H3:** 500 weight, 18px (card titles)
- **Body:** 400 weight, 16px (primary content)
- **Small:** 400 weight, 14px (metadata, labels)
- **Caption:** 400 weight, 12px (table headers, timestamps)

**Numerical Data:** Tabular figures for pricing/stats consistency

---

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Component padding: p-6 or p-8
- Section gaps: gap-6 or gap-8
- Page margins: px-6 md:px-8 lg:px-12
- Card spacing: space-y-4

**Grid Structure:**
- Dashboard: 12-column grid with sidebar (col-span-3) + main (col-span-9)
- Service cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Stats/metrics: grid-cols-2 md:grid-cols-4
- Tables: full-width with horizontal scroll on mobile

**Container Widths:**
- Dashboard content: max-w-7xl
- Forms: max-w-2xl
- Modals: max-w-lg to max-w-3xl based on content

---

## Component Library

### Navigation
- **Sidebar:** Fixed left (desktop), collapsible mobile drawer with logo, wallet balance widget, main nav items, user profile at bottom
- **Top Bar:** Transparent with search, notifications bell, user avatar dropdown
- **Breadcrumbs:** For deep navigation (Dashboard > Orders > #12345)

### Dashboard Widgets
- **Wallet Card:** Prominent balance display, "Add Funds" CTA, recent transaction preview
- **Stats Cards:** 4-column grid showing revenue, active orders, completed today, pending refunds with icon, value, and trend indicator
- **Activity Feed:** Timeline-style recent orders with status badges
- **Quick Actions:** Floating action button or prominent card for "New Order"

### Service Catalog
- **Service Cards:** Image thumbnail (platform icon), service name, price badge (₹/1K), ETA label, "Order Now" button
- **Category Tabs:** Horizontal scrolling tabs for platforms (Instagram, YouTube, etc.)
- **Filters:** Dropdown for price range, ETA sorting

### Order Interface
- **Order Form:** Multi-step or single-page with:
  - Service dropdown with search
  - Link input (auto-validation)
  - Quantity slider + input (min/max display)
  - Live price calculation display
  - Wallet balance check indicator
  - Confirm button (disabled if insufficient funds)
- **Order Tracking:** Progress stepper (Pending → Processing → Completed) with timestamps

### Data Tables
- **Order History:** Sortable columns (ID, Service, Status, Amount, Date), status badges, action menu (view details, refund)
- **Service Management (Admin):** Inline editing, bulk actions toolbar
- **Pagination:** Bottom-aligned with page numbers + prev/next

### Forms & Inputs
- **Text Fields:** Outlined style with floating labels, helper text below, error states in red
- **Dropdowns:** Custom styled with search capability for long lists
- **Amount Input:** Prefix ₹ symbol, auto-formatting for thousands
- **Toggle Switches:** For enable/disable services (admin)

### Modals & Overlays
- **Add Funds Modal:** Razorpay payment integration, amount presets (₹500, ₹1000, ₹5000, Custom)
- **Order Confirmation:** Summary view before final submission
- **Support Ticket:** Slide-over panel from right with chat interface

### Status Indicators
- **Badges:** Rounded pills with color coding (Pending=yellow, Processing=blue, Completed=green, Failed=red)
- **Progress Bars:** Linear progress for processing orders
- **Toast Notifications:** Top-right for success/error feedback

---

## Images & Visual Assets

**Icons:** Heroicons via CDN (outline style for navigation, solid for actions)

**Service Platform Icons:** 
- Dashboard stats: Small 24x24 platform logos (Instagram, YouTube, etc.)
- Service cards: 48x48 platform logos as thumbnails
- Order history: 32x32 logos in table rows

**Wallet/Payment Graphics:**
- Illustrated wallet icon for empty wallet state
- Credit card icon for payment methods
- Success checkmark animation for completed payments

**No Hero Image:** This is a dashboard application, not a marketing site. Lead with functional dashboard view immediately after login.

---

## Responsive Behavior

- **Desktop (lg+):** Full sidebar + main content, multi-column grids
- **Tablet (md):** Collapsible sidebar, 2-column grids, horizontal scroll for tables
- **Mobile (base):** Bottom navigation bar, single-column stacks, touch-optimized buttons (min 44px height)

---

## Admin-Specific Design

- **Admin Dashboard:** Additional metrics (total users, revenue graphs, system health)
- **CRUD Tables:** Inline editing with save/cancel actions, bulk selection checkboxes
- **Settings Panels:** Tab-based sections (General, Services, API, Security) with form groups
- **User Management:** Searchable table with role badges, quick actions (ban, edit, view details)

---

## Trust & Security Visual Cues

- **SSL Badge:** Small lock icon in footer
- **Payment Security:** Razorpay logo near payment forms
- **2FA Setup:** Shield icon with green checkmark when enabled
- **API Key Display:** Monospace font with copy button and visibility toggle
- **Refund Policy Link:** Always visible in wallet/order areas