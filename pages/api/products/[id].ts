import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../utils/mongodb";
import Product from "../../../models/Product";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { id } = req.query;

  try {
    await connectToDatabase();

    switch (method) {
      case "GET":
        const product = await Product.findById(id);
        if (product) {
          res.status(200).json(product);
        } else {
          res.status(404).json({ message: "Product not found" });
        }
        break;
      case "PUT":
      case "PATCH":
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
          new: true,
        });
        if (updatedProduct) {
          res.status(200).json(updatedProduct);
        } else {
          res.status(404).json({ message: "Product not found" });
        }
        break;
      case "DELETE":
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (deletedProduct) {
          res.status(204).end();
        } else {
          res.status(404).json({ message: "Product not found" });
        }
        break;
      default:
        res.setHeader("Allow", ["GET", "PUT", "PATCH", "DELETE"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
