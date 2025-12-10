/**
 * Database Seeding Script
 * Populates database with initial data including admin user
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Court = require('../models/Court');
const Equipment = require('../models/Equipment');
const Coach = require('../models/Coach');
const PricingRule = require('../models/PricingRule');
const User = require('../models/User');

const { connectDB } = require('../config/database');

// Admin credentials
const adminUser = {
  name: 'Admin User',
  email: 'admin@sportsbooking.com',
  phone: '+91-9876543210',
  password: 'admin123',
  role: 'admin',
  isActive: true
};

// Sample test user
const testUser = {
  name: 'Test User',
  email: 'user@test.com',
  phone: '+91-9876543211',
  password: 'user123',
  role: 'user',
  isActive: true
};

// [Previous sample data arrays remain the same - courts, equipment, coaches, pricingRules]

const courts = [
  {
    name: 'Indoor Court 1',
    type: 'indoor',
    sport: 'Badminton',
    basePrice: 50,
    isActive: true,
    description: 'Premium indoor badminton court with wooden flooring',
    amenities: ['Air Conditioning', 'LED Lighting', 'Spectator Seating']
  },
  {
    name: 'Indoor Court 2',
    type: 'indoor',
    sport: 'Tennis',
    basePrice: 60,
    isActive: true,
    description: 'Professional indoor tennis court',
    amenities: ['Air Conditioning', 'High Ceiling', 'Professional Net']
  },
  {
    name: 'Outdoor Court 1',
    type: 'outdoor',
    sport: 'Basketball',
    basePrice: 30,
    isActive: true,
    description: 'Full-size outdoor basketball court',
    amenities: ['Floodlights', 'Scoreboard']
  },
  {
    name: 'Outdoor Court 2',
    type: 'outdoor',
    sport: 'Tennis',
    basePrice: 35,
    isActive: true,
    description: 'Outdoor tennis court with synthetic grass',
    amenities: ['Floodlights', 'Seating Area']
  }
];

const equipment = [
  {
    name: 'Badminton Racket',
    category: 'racket',
    pricePerHour: 5,
    totalQuantity: 10,
    availableQuantity: 10,
    isActive: true,
    description: 'Professional badminton racket'
  },
  {
    name: 'Tennis Racket',
    category: 'racket',
    pricePerHour: 8,
    totalQuantity: 8,
    availableQuantity: 8,
    isActive: true,
    description: 'Professional tennis racket'
  },
  {
    name: 'Sports Shoes',
    category: 'shoes',
    pricePerHour: 10,
    totalQuantity: 15,
    availableQuantity: 15,
    isActive: true,
    description: 'Non-marking sports shoes (various sizes available)'
  },
  {
    name: 'Basketball',
    category: 'ball',
    pricePerHour: 3,
    totalQuantity: 5,
    availableQuantity: 5,
    isActive: true,
    description: 'Official size basketball'
  }
];

const coaches = [
  {
    name: 'Coach John Smith',
    specialization: 'Tennis',
    pricePerHour: 40,
    isActive: true,
    availability: [
      // Monday-Friday: 09:00-17:00 IST = 03:30-11:30 UTC
      { dayOfWeek: 1, startTime: '03:30', endTime: '11:30' },
      { dayOfWeek: 2, startTime: '03:30', endTime: '11:30' },
      { dayOfWeek: 3, startTime: '03:30', endTime: '11:30' },
      { dayOfWeek: 4, startTime: '03:30', endTime: '11:30' },
      { dayOfWeek: 5, startTime: '03:30', endTime: '11:30' }
    ],
    bio: 'Former professional tennis player with 15 years coaching experience',
    experience: 15,
    rating: 4.8
  },
  {
    name: 'Coach Sarah Johnson',
    specialization: 'Badminton',
    pricePerHour: 35,
    isActive: true,
    availability: [
      // Mon, Tue, Wed, Fri: 10:00-18:00 IST = 04:30-12:30 UTC
      { dayOfWeek: 1, startTime: '04:30', endTime: '12:30' },
      { dayOfWeek: 2, startTime: '04:30', endTime: '12:30' },
      { dayOfWeek: 3, startTime: '04:30', endTime: '12:30' },
      { dayOfWeek: 5, startTime: '04:30', endTime: '12:30' },
      // Saturday: 08:00-14:00 IST = 02:30-08:30 UTC
      { dayOfWeek: 6, startTime: '02:30', endTime: '08:30' }
    ],
    bio: 'National badminton champion and certified coach',
    experience: 10,
    rating: 4.9
  },
  {
    name: 'Coach Mike Davis',
    specialization: 'Basketball',
    pricePerHour: 45,
    isActive: true,
    availability: [
      // Tuesday, Thursday: 14:00-20:00 IST = 08:30-14:30 UTC
      { dayOfWeek: 2, startTime: '08:30', endTime: '14:30' },
      { dayOfWeek: 4, startTime: '08:30', endTime: '14:30' },
      // Saturday: 09:00-17:00 IST = 03:30-11:30 UTC
      { dayOfWeek: 6, startTime: '03:30', endTime: '11:30' },
      // Sunday: 09:00-15:00 IST = 03:30-09:30 UTC
      { dayOfWeek: 0, startTime: '03:30', endTime: '09:30' }
    ],
    bio: 'College basketball coach with expertise in skill development',
    experience: 12,
    rating: 4.7
  }
];


const pricingRules = [
  {
    name: 'Peak Hours Premium',
    description: '50% increase during peak hours (6 PM - 9 PM)',
    ruleType: 'peak_hour',
    multiplier: 1.5,
    applicableConditions: {
      courtTypes: [],
      daysOfWeek: [],
      timeRanges: [
        { startTime: '18:00', endTime: '21:00' }
      ],
      dateRanges: []
    },
    priority: 10,
    isActive: true
  },
  {
    name: 'Weekend Surcharge',
    description: '30% increase on weekends',
    ruleType: 'weekend',
    multiplier: 1.3,
    applicableConditions: {
      courtTypes: [],
      daysOfWeek: [0, 6],
      timeRanges: [],
      dateRanges: []
    },
    priority: 5,
    isActive: true
  },
  {
    name: 'Indoor Court Premium',
    description: '20% premium for indoor courts',
    ruleType: 'indoor_premium',
    multiplier: 1.2,
    applicableConditions: {
      courtTypes: ['indoor'],
      daysOfWeek: [],
      timeRanges: [],
      dateRanges: []
    },
    priority: 3,
    isActive: true
  },
  {
    name: 'Early Bird Discount',
    description: '15% discount for early morning bookings',
    ruleType: 'custom',
    multiplier: 0.85,
    applicableConditions: {
      courtTypes: [],
      daysOfWeek: [],
      timeRanges: [
        { startTime: '06:00', endTime: '09:00' }
      ],
      dateRanges: []
    },
    priority: 8,
    isActive: true
  }
];

/**
 * Seed the database
 */
const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('\n🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Court.deleteMany({});
    await Equipment.deleteMany({});
    await Coach.deleteMany({});
    await PricingRule.deleteMany({});

    console.log('✅ Existing data cleared\n');

    console.log('🌱 Creating admin user...');
    const admin = await User.create(adminUser);
    console.log(`✅ Admin created - Email: ${admin.email}, Password: admin123\n`);

    console.log('🌱 Creating test user...');
    const user = await User.create(testUser);
    console.log(`✅ Test user created - Email: ${user.email}, Password: user123\n`);

    console.log('🌱 Seeding courts...');
    await Court.insertMany(courts);
    console.log(`✅ ${courts.length} courts created\n`);

    console.log('🌱 Seeding equipment...');
    await Equipment.insertMany(equipment);
    console.log(`✅ ${equipment.length} equipment items created\n`);

    console.log('🌱 Seeding coaches...');
    await Coach.insertMany(coaches);
    console.log(`✅ ${coaches.length} coaches created\n`);

    console.log('🌱 Seeding pricing rules...');
    await PricingRule.insertMany(pricingRules);
    console.log(`✅ ${pricingRules.length} pricing rules created\n`);

    console.log('🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Users: 2 (1 admin, 1 test user)`);
    console.log(`   - Courts: ${courts.length}`);
    console.log(`   - Equipment: ${equipment.length}`);
    console.log(`   - Coaches: ${coaches.length}`);
    console.log(`   - Pricing Rules: ${pricingRules.length}`);
    console.log('\n🔐 Admin Credentials:');
    console.log(`   Email: admin@sportsbooking.com`);
    console.log(`   Password: admin123`);
    console.log('\n🔐 Test User Credentials:');
    console.log(`   Email: user@test.com`);
    console.log(`   Password: user123\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
