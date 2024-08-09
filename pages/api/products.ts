import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import Product from "../../models/Product";
import { connectToDatabase } from "../../utils/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();

  switch (req.method) {
    case "GET": {
      const {
        page = 1,
        limit = 5,
        sortBy = "createdAt",
        order = "desc",
        filterBy,
        filterValue,
      } = req.query;

      const sortOrder = order === "desc" ? -1 : 1;
      const filter =
        filterBy && filterValue ? { [filterBy as string]: filterValue } : {};

      try {
        const products = await Product.find(filter)
          .sort({ [sortBy as string]: sortOrder })
          .skip((Number(page) - 1) * Number(limit))
          .limit(Number(limit))
          .populate("provider");

        const totalProducts = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / Number(limit));

        res.status(200).json({ products, totalPages });
      } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Error fetching products" });
      }
      break;
    }

    case "POST": {
      const { name, price, description, provider } = req.body;

      if (!name || !price) {
        return res.status(400).json({ error: "Name and price are required" });
      }

      try {
        const newProduct = new Product({
          name,
          price,
          description,
          provider: provider || null,
          createdAt: new Date(),
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
      } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ error: "Error creating product" });
      }
      break;
    }

    case "PUT": {
      const { id } = req.query;
      const { name, price, description, provider } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id as string)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }

      if (!name || !price) {
        return res.status(400).json({ error: "Name and price are required" });
      }

      try {
        const updatedProduct = await Product.findByIdAndUpdate(
          id,
          {
            name,
            price,
            description,
            provider: provider || null,
            updatedAt: new Date(),
          },
          { new: true }
        );

        if (!updatedProduct) {
          return res.status(404).json({ error: "Product not found" });
        }

        res.status(200).json(updatedProduct);
      } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ error: "Error updating product" });
      }
      break;
    }

    case "DELETE": {
      const { id } = req.query;

      if (!mongoose.Types.ObjectId.isValid(id as string)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }

      try {
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
          return res.status(404).json({ error: "Product not found" });
        }

        res.status(200).json({ message: "Product deleted successfully" });
      } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: "Error deleting product" });
      }
      break;
    }

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
