const mongoose = require('mongoose');

// ── Employee Schema ────────────────────────────────────────────────────────────
const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Employee name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
      enum: {
        values: ['Engineering', 'Design', 'HR', 'Marketing', 'Finance', 'Operations', 'Sales', 'Other'],
        message: '{VALUE} is not a valid department',
      },
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
      maxlength: [100, 'Role cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    phone: {
      type: String,
      trim: true,
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: ['Active', 'Inactive', 'On Leave'],
        message: '{VALUE} is not a valid status',
      },
      default: 'Active',
    },
    joiningDate: {
      type: Date,
      default: Date.now,
    },
    salary: {
      type: Number,
      min: [0, 'Salary cannot be negative'],
      default: null,
    },
    avatar: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
    versionKey: false,
  }
);

// ── Index for faster queries ───────────────────────────────────────────────────
employeeSchema.index({ department: 1, status: 1 });
employeeSchema.index({ email: 1 }, { unique: true });

// ── Virtual: full display label ────────────────────────────────────────────────
employeeSchema.virtual('displayLabel').get(function () {
  return `${this.name} — ${this.role} (${this.department})`;
});

// ── Export Model ───────────────────────────────────────────────────────────────
const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
