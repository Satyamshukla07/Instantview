const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema (simplified from server/models.ts)
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  name: String,
  phone: String,
  role: { type: String, default: 'user' },
  walletBalance: { type: Number, default: 0 },
  referralCode: String,
  referredBy: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function createAdminUser() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://smmpanel:smmpanelpassword@smmcluster.ltlnh0v.mongodb.net/reelboost?retryWrites=true&w=majority';
    await mongoose.connect(MONGODB_URI);
    
    console.log('Connected to MongoDB');
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@reelboost.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists! Deleting and recreating...');
      await User.deleteOne({ email: 'admin@reelboost.com' });
      console.log('Existing admin deleted.');
    }
    
    {
      // Generate referral code
      const referralCode = Math.random().toString(36).substring(2, 10).toUpperCase();
      
      // Hash password
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      
      // Create admin user
      const adminUser = await User.create({
        email: 'admin@reelboost.com',
        password: hashedPassword,
        name: 'Admin User',
        role: 'admin',
        walletBalance: 10000,
        referralCode: referralCode
      });
      
      console.log('Admin user created successfully!');
      console.log('Email:', adminUser.email);
      console.log('Password: Admin@123');
      console.log('Role:', adminUser.role);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

createAdminUser();
