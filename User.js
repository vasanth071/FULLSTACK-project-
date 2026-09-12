const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the User schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,   // no duplicate emails
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['student', 'admin'],  // only these two values allowed
      default: 'student'
    },
    department: {
      type: String,
      required: true
    },
    rollNumber: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true  // adds createdAt and updatedAt automatically
  }
);

// Before saving a user, hash the password
userSchema.pre('save', async function (next) {
  // Only hash if the password was modified (or is new)
  if (!this.isModified('password')) return next();

  // Hash password with salt rounds = 10
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with hashed password in DB
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
