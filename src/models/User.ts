import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { IDepartment } from './Department';

export interface IUser extends Document {
  username: string;
  password: string;
  role: 'employee' | 'manager';
  salary: number;
  yearsOfExperience: number;
  startDate: Date;
  age: number;
  lastClockIn: Date;
  department: IDepartment['_id'];  // הוספת שדה חדש
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['employee', 'manager'], default: 'employee' },
  salary: { type: Number, required: true },
  yearsOfExperience: { type: Number, required: true },
  startDate: { type: Date, required: true },
  age: { type: Number, required: true },
  lastClockIn: { type: Date },
  department: { type: Schema.Types.ObjectId, ref: 'Department' }  // הוספת שדה חדש
}, { timestamps: true });

UserSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.index({ username: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ salary: 1 });

export default mongoose.model<IUser>('User', UserSchema);
