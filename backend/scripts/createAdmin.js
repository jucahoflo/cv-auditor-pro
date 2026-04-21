const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI);

const User = require('../models/User');

const createAdmin = async () => {
  try {
    const adminEmail = 'admin@killerjobs.com';
    
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log('✅ El administrador ya existe.');
      console.log('📧 Email:', adminEmail);
      console.log('🔑 Contraseña: Admin123456');
      process.exit();
    }

    const hashedPassword = await bcrypt.hash('Admin123456', 10);
    
    const admin = new User({
      name: 'Administrador',
      email: adminEmail,
      password: hashedPassword,
      subscription: {
        plan: 'enterprise',
        creditsLimit: 999999,
        creditsUsed: 0,
        role: 'admin'
      }
    });
    
    await admin.save();
    console.log('✅ Administrador creado exitosamente');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Contraseña: Admin123456');
    process.exit();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createAdmin();