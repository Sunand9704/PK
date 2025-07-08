// Environment variable validation
const validateEnv = () => {
  const required = [
    "JWT_SECRET",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "EMAIL_USER",
    "EMAIL_PASS",
  ];

  // Optional but recommended
  const recommended = ["ALLOWED_ORIGINS"];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error("❌ Missing required environment variables:");
    missing.forEach((key) => console.error(`   - ${key}`));
    console.error(
      "\nPlease check your .env file and ensure all required variables are set."
    );
    process.exit(1);
  }

  // Check for recommended variables
  const missingRecommended = recommended.filter((key) => !process.env[key]);
  if (missingRecommended.length > 0) {
    console.warn("⚠️  Missing recommended environment variables:");
    missingRecommended.forEach((key) => console.warn(`   - ${key}`));
    console.warn(
      "\nThese variables are optional but recommended for better security and configuration."
    );
  }
};

module.exports = validateEnv;
