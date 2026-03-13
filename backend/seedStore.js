require('dotenv').config();
const mongoose = require('mongoose');
const StoreItem = require('./models/StoreItem');

const seedItems = [
  { name: 'Golden Avatar Ring', description: 'Show off your dedication with a glowing avatar border.', cost: 50, icon: '🌟' },
  { name: 'Dark Nebula Theme', description: 'Unlock the exclusive deep-space color theme for your dashboard.', cost: 150, icon: '⚡' },
  { name: 'Scholar Badge', description: 'Display the scholar badge next to your name in leaderboards.', cost: 300, icon: '🛡️' },
  { name: 'Custom Quiz Background', description: 'Choose your own gradient background when taking quizzes.', cost: 500, icon: '🏆' }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding');
    
    await StoreItem.deleteMany();
    await StoreItem.insertMany(seedItems);
    
    console.log('Store items seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data', error);
    process.exit(1);
  }
};

seedDB();
