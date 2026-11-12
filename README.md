# L'Ã‰LIXIR | Haute BeautÃ© & Luxury Parlour Website

An international, luxury beauty parlour and salon web application with a **Cinematic 3D Parlour Door Opening Animation**, an **editorial haute couture customer experience**, an **end-to-end appointment booking engine with slot conflict prevention**, and a **management admin dashboard**.

---

## ðŸŒŸ Key Highlights & Design Direction

- **Brand Aesthetic**: High-fashion Parisian & Swiss luxury aesthetic with champagne beige (`#F5EFEB`), warm ivory (`#FAF7F2`), rose gold accents (`#B76E79`), and deep espresso brown (`#231713`).
- **Typography**: Editorial headings in *Playfair Display* & *Cormorant Garamond*; clean, modern UI body in *Plus Jakarta Sans* & *Poppins*.
- **Special Feature: 3D Grand Parlour Door Entrance**:
  - Closed double doors with French moulding, gold handles, and warm interior glow.
  - Realistic 3D perspective transforms (`rotateY(-105deg)` and `rotateY(105deg)`).
  - Volumetric center light leak, letter-by-letter brand identity reveal (`L'Ã‰LIXIR`), camera push-in transition, skip option, and session memory (with a replay button on the navbar).
- **Custom Desktop Cursor**: Trailing gold precision ring & dot that smoothly morphs upon hovering over interactive elements.
- **Floating WhatsApp Concierge**: Instant direct WhatsApp concierge chat with pulsing glow and pre-filled inquiry message.

---

## ðŸ›ï¸ Customer Website Experience

1. **Top Announcement Bar**: Privilege club announcements with instant action link.
2. **Sticky Luxury Navbar**:
   - Monogram logo (`Ã‰`) and typography.
   - Smooth navigation links (`Services`, `Packages`, `Offers`, `Gallery`, `Experience`, `Reviews`, `Contact`).
   - "Track Reservation" button with confidential Booking ID lookup.
   - "Doors" replay button to re-trigger the 3D Grand Entrance.
   - "Book Appointment" luxury CTA button.
   - Mobile responsive menu drawer.
3. **Animated Hero Section**:
   - High-definition salon background with cinematic zoom.
   - Animated text reveals, floating luxury badges (Haute BeautÃ© 2025, 4.98/5.0 VIP Rating).
   - Dual CTAs: *Book Appointment* and *Explore Services*.
   - Animated counters (15k+ Guests, 12+ Master Aestheticians, 99.4% Satisfaction, 8 Private Suites).
   - Interactive scroll indicator.
4. **About the Parlour & Atelier Philosophy**:
   - Editorial split imagery layout with gold seal badge.
   - Brand story grounded in Parisian haute couture and Swiss botanical science.
   - Interactive "Meet Our Experts" modal with master stylists (Claudette Moreau, Dr. ValÃ©rie Laurent, Seraphina Rossi).
5. **Our Signature Services (Dynamically Loaded)**:
   - 12+ luxury treatments:
     - Haute Haircut & Bespoke Styling
     - Caviar & Keratin Luxury Hair Spa
     - Balayage & Couture Hair Colour
     - 24K Gold Cellular Rejuvenation Facial
     - Hydra-Glow Deep Pore Cleanup
     - Haute Couture Bridal Artistry
     - Red Carpet Gala & Party Makeup
     - Rose Quartz Velvet Manicure
     - Aromatherapy Botanical Pedicure
     - Organic Honey & Chocolate Waxing
     - Bespoke Designer Gel Extensions & Nail Art
     - Micro-Precision Brow Sculpting & Threading
   - Category filtering (`All`, `Hair`, `Skin & Facials`, `Makeup & Bridal`, `Nails & Spa`).
   - Instant live search.
   - Treatment details modal with benefits, suite ambiance, and one-click booking.
6. **Exclusive Packages**:
   - Curated multi-hour transformation rituals (The Royal Bridal Symphony, Golden Radiance Anti-Aging, Parisian Weekend Glamour Edit, Silk Velvet Hair Renewal).
   - Inclusions checkmarks, original vs. discounted prices, savings badges, validity periods, and direct reservation triggers.
7. **Special Offers & Discounts**:
   - Limited-time promotions (e.g. `FIRSTGLAM`, `ROYAL15`, `GLOWFEST`).
   - Real-time countdown timer (`Expires in: Xd Xh Xm Xs`).
   - Click-to-copy coupon codes with visual confirmation.
   - "Apply to Reservation" button that pre-selects the coupon in the booking wizard.
8. **Our Work & Portfolio Gallery**:
   - Filterable masonry grid (`Bridal`, `Hair`, `Skin & Facials`, `Nails`, `Makeup`).
   - Interactive Before-and-After split slider: drag left/right to inspect genuine transformations.
   - Full-screen lightbox image viewer with zoom, next/prev navigation, and descriptions.
9. **Guest Reviews & Testimonials**:
   - Testimonial carousel with star ratings, client photos, verified guest tags, and treatment references.
10. **Why Choose Us**:
    - 6 core luxury standards: Master European Artisans, Swiss/French Organic Serums, Hospital-Grade Purity & Sterilization, Individual Marble Suites, Bespoke Facial Architecture, 100% Satisfaction Guarantee.
11. **Contact & Location**:
    - Physical address, direct telephone, opening hours, interactive Google Maps embed.
    - Quick concierge inquiry form.
12. **Editorial Footer**:
    - VIP Society newsletter subscription with feedback toast.
    - Curated links, operating hours, direct concierge contacts.
    - Interactive "Privacy Policy" and "Terms & Conditions" modals.

---

## ðŸ“… Multi-Step Appointment Booking System

- **Step 1: Treatment Selection**:
  - Toggle between Bespoke Services and VIP Packages.
  - Displays duration, price, and descriptions.
- **Step 2: Date Picker**:
  - Blocks past dates.
  - Automatically checks against parlour working days (e.g. Mon-Sun) and blocked holiday dates configured by the admin.
- **Step 3: Dynamic Time Slot Calculation & Conflict Prevention**:
  - Calculates slots dynamically based on salon open time, close time, break duration, and slot interval (e.g. 45 min).
  - Cross-references existing Firestore/database reservations in real-time.
  - Compares against maximum suite capacity per slot.
  - Completely blocks already-booked slots from being selected.
- **Step 4: Guest Information**:
  - Full Name, WhatsApp mobile number, Email (optional), and special requests/allergies.
- **Step 5: Pricing & Coupon Validation**:
  - Validates active coupon codes, expiration dates, minimum spend thresholds, and maximum discount caps.
  - Computes exact discount and displays transparent breakdown.
  - Clear "Pay at Parlour" notice (Cash/Card accepted upon treatment).
- **Step 6: Atomic Booking Confirmation & VIP Pass**:
  - Generates a unique reference ID (e.g. `LX-74819A`).
  - Confetti celebration animation.
  - Displays a printable VIP Pass card with booking details.
  - One-click WhatsApp concierge confirmation link.

### ðŸ” Confidential Reservation Tracking
- Accessible from the top navbar ("Track").
- Requires both **Booking ID** and **Registered Mobile Phone Number** (prevents public data exposure).
- Displays live status: `Pending`, `Confirmed`, `Completed`, or `Cancelled`.
- Direct button to contact the parlour concierge regarding the booking.

---

## ðŸ›¡ï¸ Admin Dashboard & Control Suite

Customers and administrators use the same sign-in form. The account role determines whether sign-in opens the customer website or the admin dashboard.

- **Admin Authentication**:
  - Firebase email/password sign-in; no administrator email or password is included in client code or shown on screen.
  - Access requires either a custom `admin: true` Firebase Auth claim or an `admins/{uid}` Firestore document.
  - Create the user in Firebase Authentication, then create an `admins` Firestore document whose document ID is that user's Firebase UID.
  - An authorized administrator signing in through the shared form is directed to the admin dashboard.
- **Overview Dashboard**:
  - 8 real-time KPI stat cards: Total Bookings, Today's Appointments, Pending Approvals, Confirmed Reservations, Total Revenue Value, Active Services, Active Offers, Cancelled/Rejected.
  - Recent appointments preview table with instant status indicators.
  - Sample records are removed automatically from browser storage; the dashboard can remove remaining built-in sample records.
- **A. Booking Management**:
  - Search by guest name, reference ID, or phone number.
  - Filter by status (`All`, `Pending`, `Confirmed`, `Completed`, `Cancelled`) and date.
  - Live status dropdown updater.
  - **Reschedule Appointment modal**: update date and time.
  - **Internal Staff Notes modal**: save private guest preferences.
  - Export all filtered reservations to **CSV**.
  - Delete reservation with confirmation.
- **B. Services Management**:
  - Add new service modal (Name, Category, Price, Duration, Image URL, Description, Publish toggle).
  - Edit service details.
  - Live toggle to publish/unpublish services from the public website.
  - Delete service with confirmation.
- **C. Packages Management**:
  - Create new VIP package (Name, Tagline, Original price, Discounted price, Included services list, Validity, Badge, Image URL).
  - Activate/deactivate package toggle.
  - Edit & delete package.
- **D. Offers & Discounts Management**:
  - Create promotional coupons (Code, Title, Percentage or Fixed discount, Min spend, Max discount cap, Expiry date, Usage limit).
  - Activate/deactivate coupon toggle.
  - Tracks coupon usage counts.
- **E. Gallery & Portfolio Management**:
  - Add photos with title, category (`Bridal`, `Hair`, `Skin & Facials`, `Nails`, `Makeup`), image URL, and description.
  - Delete gallery items.
- **F. Customer Directory**:
  - Aggregates unique client records by phone number.
  - Displays total visits, lifetime spend, and last visit date.
  - "History" modal showing all previous reservations for each guest.
- **G. Website Settings**:
  - Parlour brand name, tagline, hero headline, sub-headline, top announcement banner.
  - Telephone, WhatsApp number, email, address, operating hours.
  - Social media links (Instagram, Facebook) and Google Maps embed URL.
- **H. Appointment Rules & Schedule Settings**:
  - Active weekly working days (Monday â€“ Sunday toggles).
  - Opening time, closing time, break start, and break end.
  - Slot interval minutes (30, 45, 60, 90 mins).
  - Max concurrent capacity per slot (suites available).
  - Block specific dates & holidays with custom reasons (e.g. Christmas, Renovation).

---

## ðŸ—„ï¸ Database & Firebase Architecture

### Collections Structure
- `services`: Published/unpublished treatments, pricing, duration, categories, and imagery.
- `packages`: Curated packages, included services, original/discounted rates, validity.
- `offers`: Coupon codes, percentage/fixed amounts, expiry dates, min spend, usage limits.
- `bookings`: Complete booking records with unique IDs, customer info, date, time, pricing, status, and internal notes.
- `gallery`: Portfolio photographs, titles, categories.
- `experience`: Homepage experience cards managed by the administrator.
- `settings`: Salon brand identity, contacts, announcements, Google Maps embed.
- `settings/schedule`: Working days, hours, slot intervals, capacity, and blocked dates.
- `admins`: Authorized administrator accounts.

### Firebase Setup & Local Storage
1. **Firebase mode**: Set the `VITE_FIREBASE_*` configuration values in `.env` to connect Firestore, Firebase Authentication, and Storage. Create the administrator's account with Firebase Authentication and authorize its UID as described above.
2. **Local data mode**: Without Firebase configuration, salon content and bookings are stored in the current browser local storage and persist on that device. New content starts empty; it is not synchronized across devices.
3. **Security rules**: Deploy `firestore.rules`. Bootstrap an admin by creating an `admins/{uid}` document in the Firebase console for the administrator's Firebase Auth UID, or use a custom `admin: true` claim.

---

## ðŸš€ Setup & Development Commands

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Locally in Development Mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
```

### 4. Deploying to Firebase Hosting (Optional)
```bash
npm install -g firebase-tools
firebase login
firebase init
firebase deploy
```

---

## ðŸŽ¨ Color Palette Reference

| Token | Color | Hex Code |
|---|---|---|
| **Champagne Beige** | Primary background & cards | `#F5EFEB` / `#FAF7F2` |
| **Warm Ivory** | Background light | `#FFFDF9` |
| **French Gold** | Primary metallic accent | `#D4AF37` / `#B8860B` |
| **Rose Gold** | Secondary blush accent | `#B76E79` / `#EDC9C5` |
| **Espresso Brown** | Primary text & luxury dark | `#231713` / `#1A110D` |
