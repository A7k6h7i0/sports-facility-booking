A full‑stack MERN application for booking indoor and outdoor sports facilities with optional equipment and coaching. Users can browse courts, check real‑time availability, apply dynamic pricing rules, and manage their bookings. Admins can manage resources (courts, equipment, coaches) and pricing rules from an admin dashboard.

✨ Features
For Users
Authentication & Authorization

JWT-based login and registration

Seeded test accounts for quick access (admin + user)

Court Browsing & Selection

Indoor and outdoor courts with base price, sport type, description, and amenities

Clear separation of date, start time, and end time in the booking flow

Smart Booking Flow (Multi‑step Modal)

Select court and time

Choose add‑ons (equipment)

Optionally add a coach

Review full summary and price breakdown before confirming

Real‑time Availability Checks

Courts – prevents double bookings for overlapping time ranges

Equipment – checks quantities already reserved in the same slot

Coaches – validates:

Day of week (weekly schedule)

Time window (start/end working hours)

Existing bookings to avoid conflicts

Detailed, user‑friendly error messages (e.g. “Coach is only available from 09:00 to 15:00 on this day”)

Dynamic Pricing & Taxes

Court base price per hour

Pricing rules (stackable):

Peak hour premium

Weekend surcharge

Indoor court premium

Early bird discount

Custom rules

Equipment and coach hourly charges

Tax/GST calculation and clear total

Price Breakdown panel showing:

Duration

Base court price

Applied rules with multipliers

Equipment and coach cost

Subtotal, tax, and grand total

Coach Selection UI

Cards showing:

Name, specialization, bio

Experience and rating

Price per hour

Availability grid by day and time ranges

Coaches are optional and can be toggled on/off

Availability errors are explained clearly, with tips for changing time or removing the coach

My Bookings

List of all user bookings with:

Status badge (confirmed / cancelled / completed)

Court, date & time range, and whether a coach is included

Total price

Ability to cancel bookings (with proper equipment quantity rollback)

For Admins
Admin Login

Separate admin role with seeded credentials

Resource Management

Courts: create, edit, activate/deactivate

Equipment: create, edit, manage total & available quantity, activate/deactivate

Coaches: create, edit, define weekly availability and hourly rate, activate/deactivate

Pricing Rules Management

Define rule type (peak_hour, weekend, indoor_premium, seasonal, custom)

Configure:

Court types

Days of week

Time ranges

Date ranges

Multiplier and priority

Multiple rules can apply at once; higher priority rules override as required

Booking Oversight

View all bookings including user, court, time slot, resources, and pricing

Filter and inspect bookings for operations and support

🧱 Tech Stack
Frontend
React 18

Vite

React Router

Axios

Tailwind CSS (utility‑first styling)

Custom components:

BookingModal (multi‑step)

CourtSelector, EquipmentSelector, CoachSelector

PriceBreakdown

Common components for Modal, Button, Loader, ErrorMessage

Backend
Node.js + Express

MongoDB + Mongoose

JWT authentication & authorization middleware

Layered architecture:

Models: User, Court, Equipment, Coach, Booking, PricingRule

Services:

availabilityService – checks court, equipment, and coach availability

pricingService – calculates full pricing breakdown based on rules

bookingService – creates and cancels bookings with MongoDB transactions

Controllers: thin HTTP layer mapping routes to services

Utilities:

timeUtils – time range overlap, duration, validation helpers

seedData – initial data for courts, equipment, coaches, pricing rules, users

Centralized error handling middleware

Infrastructure
Backend: Render (Node web service)

Frontend: Vercel

Database: MongoDB Atlas

Environment‑based configuration using .env files (never committed) and environment variables on Render/Vercel

CORS configured for:

Local dev (http://localhost:3000 / http://localhost:5173)

Production Vercel URLs

📂 Project Structure (High Level)
bash
.
├── backend
│   ├── server.js
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Court.js
│   │   ├── Equipment.js
│   │   ├── Coach.js
│   │   ├── Booking.js
│   │   └── PricingRule.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── courtRoutes.js
│   │   ├── equipmentRoutes.js
│   │   ├── coachRoutes.js
│   │   ├── pricingRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── adminRoutes.js
│   ├── controllers/
│   ├── services/
│   │   ├── availabilityService.js
│   │   ├── bookingService.js
│   │   └── pricingService.js
│   ├── utils/
│   │   ├── timeUtils.js
│   │   └── seedData.js
│   └── middleware/
│       ├── authMiddleware.js
│       └── errorHandler.js
│
└── frontend
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── routes/
        ├── components/
        │   ├── booking/
        │   │   ├── BookingModal.jsx
        │   │   ├── CourtSelector.jsx
        │   │   ├── EquipmentSelector.jsx
        │   │   ├── CoachSelector.jsx
        │   │   └── PriceBreakdown.jsx
        │   └── common/
        │       ├── Modal.jsx
        │       ├── Button.jsx
        │       ├── Loader.jsx
        │       └── ErrorMessage.jsx
        ├── con /
        │   └── AuthCon .jsx
        ├── services/
        │   └── api.js
        ├── utils/
        │   ├── constants.js
        │   └── dateUtils.js
        └── styles/
🚀 Getting Started (Local Development)
Prerequisites
Node.js (LTS)

npm or yarn

MongoDB (local) or MongoDB Atlas connection URI

1. Clone the repository
bash
git clone https://github.com/<your-username>/sports-facility-booking.git
cd sports-facility-booking
2. Backend Setup
bash
cd backend
npm install
Create a .env file in backend:

 
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/sports_facility_booking

JWT_SECRET=your_dev_jwt_secret_here
JWT_EXPIRE=7d

# For CORS (local)
FRONTEND_URL=http://localhost:3000
Seed the database (admin, test user, courts, equipment, coaches, pricing rules):

bash
npm run seed
Start the backend server:

bash
npm run dev
The backend will run at:

 
http://localhost:5000
Health check:

 
GET http://localhost:5000/health
3. Frontend Setup
Open a new terminal:

bash
cd frontend
npm install
Create a .env file in frontend:

 
VITE_API_URL=http://localhost:5000/api
Start the frontend dev server:

bash
npm run dev
The app will be available at:

 
http://localhost:5173
# or  http://localhost:3000  (depending on your Vite config)
🌐 Production Deployment
Backend (Render)
Deploy the backend folder as a Node web service

Typical settings:

Build command: npm install

Start command: node server.js

Environment variables (set in Render dashboard):

 
PORT=5000
NODE_ENV=production
MONGODB_URI=<your-mongodb-atlas-uri>
JWT_SECRET=<strong-production-secret>
JWT_EXPIRE=7d
FRONTEND_URL=https://<your-vercel-app>.vercel.app
After the first deployment, run the seed script against production DB (either locally with the production URI in .env or via a one‑off job) so that admin/user, courts, equipment, coaches, and pricing rules exist.

Frontend (Vercel)
Import the GitHub repo into Vercel

Set project root to frontend

Build command: npm run build

Output directory: dist

Environment variables in Vercel:

 
VITE_API_URL=https://<your-render-backend>.onrender.com/api
Trigger a deployment. Once live, ensure:

Hitting /health on the backend works

The Vercel app can log in and create bookings without CORS issues

🔑 Seeded Credentials
After running the seed script:

Admin

Email: admin@sportsbooking.com

Password: admin123

Test User

Email: user@test.com

Password: user123

You can change these in backend/utils/seedData.js before seeding.

🧪 Important Implementation Details
Time & Availability Logic

Bookings are stored with full Date objects.

Coach availability is defined per day of week with start/end times.

The backend checks:

That the booking falls inside the coach’s working window for that day.

That there are no overlapping bookings for the same coach.

Special care is taken to avoid off‑by‑one and timezone issues in production.

Booking Transactions

Booking creation runs inside a MongoDB session/transaction:

Verifies availability for court, equipment, coach.

Calculates full pricing (including rules and tax).

Saves the booking.

Updates equipment quantities.

Any error aborts the transaction and returns a clear error message.

Error Handling & UX

Backend returns structured JSON with success, data, error, and optional message.

Frontend surfaces these as friendly banners, especially in the booking modal:

“Court already booked for this time slot”

“Coach is only available from 09:00 to 15:00 on this day”

“Some equipment items are not available”
 
✅ Roadmap / Possible Improvements
Online payments integration (Razorpay / Stripe)

Email notifications on booking confirmation and cancellation

Calendar view for courts and coaches

More advanced reporting and analytics in the admin dashboard

Multi‑location / multi‑facility support

📄 License
This project is provided for learning and portfolio purposes. You can adapt it for your own use; if you publish a derivative project, consider giving credit in your README.

🙋‍♂️ Author
Built as a production‑style MERN stack project with a focus on:

Clean architecture on the backend

Realistic booking rules and edge cases

A smooth, guided booking experience on the frontend

Deploying and debugging in real cloud environments (Render + Vercel)