require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');
const adminRoutes = require('./routes/admin');
const path = require('path');
const User = require('./models/User');

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Campus Lost & Found Backend is running!' });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = 'mongodb://localhost:27017/campus_lost_found';

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected successfully!');

    try {
      const adminExists = await User.findOne({ email: 'admin@gmail.com' });
      if (!adminExists) {
        await User.create({
          name: 'Admin',
          email: 'admin@gmail.com',
          password: 'admin123',
          department: 'Administration',
          rollNumber: 'ADMIN',
          role: 'admin'
        });
        console.log('Admin user seeded.');
      }
    } catch (err) {
      console.error('Failed to seed admin:', err);
    }

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  });
