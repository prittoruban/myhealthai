import mongoose, { Schema, Model } from 'mongoose';

export interface IUser {
  _id?: mongoose.Types.ObjectId;
  email: string;
  password: string;
  dailyOilGoal: number;
  points: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    dailyOilGoal: {
      type: Number,
      default: 30,
      min: [0, 'Daily oil goal cannot be negative'],
    },
    points: {
      type: Number,
      default: 0,
      min: [0, 'Points cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation in development
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
