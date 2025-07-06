const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Admin = require("./models/Admin");

const adminUsers = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  },
  {
    name: "Super Admin",
    email: "superadmin@example.com",
    password: "admin123",
    role: "admin",
  },
];

const seed = async () => {
  await connectDB();
  try {
    // Clear existing admins
    await Admin.deleteMany();

    // Insert new admin users
    for (const adminData of adminUsers) {
      const admin = new Admin(adminData);
      await admin.save();
    }
    console.log("Database seeded with admin users!");
    console.log("Admin credentials:");
    adminUsers.forEach((admin) => {
      console.log(`Email: ${admin.email}, Password: ${admin.password}`);
    });
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
