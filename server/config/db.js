const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    throw new Error('MONGO_URI is not defined');
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoURI);
  console.log('MongoDB connected');
};

module.exports = connectDB;

