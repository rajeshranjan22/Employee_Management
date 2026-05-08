const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ── User Schema ────────────────────────────────────────────────────────────────
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Never return password in queries by default
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
    },
    department: {
      type: String,
      trim: true,
      enum: {
        values: [
          "Engineering",
          "Design",
          "HR",
          "Marketing",
          "Finance",
          "Operations",
          "Sales",
          "Other",
          "All", 
        ],
        message: "{VALUE} is not a valid department",
      },
      default: "All",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    shift: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shift',
    },
    lastClockIn: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// ── Pre-save Hook: Hash password before saving ─────────────────────────────────
userSchema.pre('save', async function () {
  // Only hash if password was modified (or is new)
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ── Instance Method: Compare password ─────────────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ── Export Model ───────────────────────────────────────────────────────────────
const User = mongoose.model('User', userSchema);

module.exports = User;
