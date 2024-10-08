import mongoose, { Schema, Document } from 'mongoose';

export interface IDepartment extends Document {
  name: string;
  description: string;
}

const DepartmentSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String }
});

export default mongoose.model<IDepartment>('Department', DepartmentSchema);