import mongoose, { Document, Schema } from 'mongoose';

export interface Provider extends Document {
  name: string;
  address?: string;
  phone?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const providerSchema: Schema = new Schema<Provider>(
  {
    name: { type: String, required: true },
    address: { type: String },
    phone: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

const ProviderModel =
  mongoose.models.Provider || mongoose.model<Provider>('Provider', providerSchema);

export default ProviderModel;
