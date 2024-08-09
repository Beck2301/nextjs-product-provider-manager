import mongoose, { Document, Schema } from 'mongoose';

export interface Product extends Document {
  name: string;
  price: number;
  description?: string;
  provider?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const productSchema: Schema = new Schema<Product>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    provider: { type: Schema.Types.ObjectId, ref: 'Provider' },
  },
  { timestamps: true }
);

const ProductModel =
  mongoose.models.Product || mongoose.model<Product>('Product', productSchema);

export default ProductModel;
