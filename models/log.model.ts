import mongoose, { Schema, Model } from 'mongoose';

export interface IConsumptionLog {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  mealName: string;
  oilType: string;
  quantityInMl: number;
  createdAt?: Date;
}

const ConsumptionLogSchema = new Schema<IConsumptionLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    mealName: {
      type: String,
      required: [true, 'Meal name is required'],
      trim: true,
    },
    oilType: {
      type: String,
      required: [true, 'Oil type is required'],
      trim: true,
    },
    quantityInMl: {
      type: Number,
      required: [true, 'Quantity in ml is required'],
      min: [0, 'Quantity cannot be negative'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false, // We manually handle createdAt
  }
);

// Compound index for efficient querying of user logs by date
ConsumptionLogSchema.index({ userId: 1, createdAt: -1 });

// Prevent model recompilation in development
const ConsumptionLog: Model<IConsumptionLog> =
  mongoose.models.ConsumptionLog ||
  mongoose.model<IConsumptionLog>('ConsumptionLog', ConsumptionLogSchema);

export default ConsumptionLog;
