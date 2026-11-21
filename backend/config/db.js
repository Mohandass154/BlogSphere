const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (mongoUri && mongoUri.trim() !== '') {
      console.log('Connecting to MongoDB...');
      await mongoose.connect(mongoUri);
      console.log(`MongoDB Connected successfully: ${mongoose.connection.host} (Database: ${mongoose.connection.name})`);
      return;
    }

    console.log('No MONGODB_URI provided in .env. Initializing in-memory MongoDB for seamless development...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    console.log(`Connected to In-Memory MongoDB at ${uri}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // If external URI fails, try memory server fallback so the app stays functional
    try {
      console.log('Attempting fallback to in-memory MongoDB...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log(`Fallback connected to In-Memory MongoDB at ${uri}`);
    } catch (fallbackErr) {
      console.error(`Failed to start MongoDB fallback: ${fallbackErr.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
