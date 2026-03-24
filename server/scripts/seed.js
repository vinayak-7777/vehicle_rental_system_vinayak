require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Payment = require('../models/Payment');
const connectDB = require('../config/db');

// Sample vehicles data
const vehicles = [
  {
    vehicleName: 'Toyota Corolla',
    category: 'Car',
    pricePerDay: 50,
    imageURL: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400',
    isAvailable: true,
    conditionStatus: 'Good',
  },
  {
    vehicleName: 'Honda Civic',
    category: 'Car',
    pricePerDay: 55,
    imageURL: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400',
    isAvailable: true,
    conditionStatus: 'Good',
  },
  {
    vehicleName: 'Ford F-150',
    category: 'Truck',
    pricePerDay: 80,
    imageURL: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400',
    isAvailable: true,
    conditionStatus: 'Good',
  },
  {
    vehicleName: 'Yamaha R15',
    category: 'Bike',
    pricePerDay: 30,
    imageURL: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=400',
    isAvailable: true,
    conditionStatus: 'Good',
  },
  {
    vehicleName: 'Honda CBR 250',
    category: 'Bike',
    pricePerDay: 35,
    imageURL: 'https://images.unsplash.com/photo-1558980664-1db506751c6c?w=400',
    isAvailable: true,
    conditionStatus: 'Good',
  },
  {
    vehicleName: 'Tesla Model 3',
    category: 'Car',
    pricePerDay: 120,
    imageURL: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400',
    isAvailable: false,
    conditionStatus: 'Maintenance',
  },
  {
    vehicleName: 'BMW 3 Series',
    category: 'Car',
    pricePerDay: 100,
    imageURL: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=400',
    isAvailable: true,
    conditionStatus: 'Good',
  },
  {
    vehicleName: 'Kawasaki Ninja',
    category: 'Bike',
    pricePerDay: 40,
    imageURL: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400',
    isAvailable: true,
    conditionStatus: 'Good',
  },
];

// Sample users data (passwords will be hashed)
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'Fleet Manager',
    email: 'fleet@example.com',
    password: 'fleet123',
    role: 'fleetManager',
  },
  {
    name: 'Auditor User',
    email: 'auditor@example.com',
    password: 'auditor123',
    role: 'auditor',
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'user123',
    role: 'user',
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'user123',
    role: 'user',
  },
];

const seedData = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('MongoDB connected');

    // Clear existing data (optional - comment out if you want to keep existing data)
    await User.deleteMany({});
    await Vehicle.deleteMany({});
    await Payment.deleteMany({});
    console.log('Cleared existing data');

    // Hash passwords and create users
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return {
          ...user,
          password: hashedPassword,
        };
      })
    );

    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`Created ${createdUsers.length} users`);

    // Create vehicles
    const createdVehicles = await Vehicle.insertMany(vehicles);
    console.log(`Created ${createdVehicles.length} vehicles`);

    console.log('\n✅ Sample data seeded successfully!');
    console.log('\n📝 Default Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin:      admin@example.com / admin123');
    console.log('Fleet Mgr:  fleet@example.com / fleet123');
    console.log('Auditor:    auditor@example.com / auditor123');
    console.log('User:       john@example.com / user123');
    console.log('User:       jane@example.com / user123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
