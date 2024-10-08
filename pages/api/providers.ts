import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import Provider from "../../models/Provider";
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
        query,
      } = req.query;
      const sortOrder = order === "desc" ? -1 : 1;
      const searchQuery = query
        ? { name: { $regex: query as string, $options: "i" } }
        : {};

      try {
        const providers = await Provider.find(searchQuery)
          .sort({ [sortBy as string]: sortOrder })
          .skip((Number(page) - 1) * Number(limit))
          .limit(Number(limit));

        const totalProviders = await Provider.countDocuments(searchQuery);
        const totalPages = Math.ceil(totalProviders / Number(limit));

        res.status(200).json({ providers, totalPages });
      } catch (error) {
        console.error("Error fetching providers:", error);
        res.status(500).json({ error: "Error fetching providers" });
      }
      break;
    }

    case "POST": {
      const { name, address, phone, description } = req.body;

      if (!name || !address) {
        return res.status(400).json({ error: "Name and address are required" });
      }

      try {
        const newProvider = new Provider({
          name,
          address,
          phone,
          description,
          createdAt: new Date(),
        });

        const savedProvider = await newProvider.save();
        res.status(201).json(savedProvider);
      } catch (error) {
        console.error("Error creating provider:", error);
        res.status(500).json({ error: "Error creating provider" });
      }
      break;
    }

    case "PUT": {
      const { id } = req.query;
      const { name, address, phone, description } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id as string)) {
        return res.status(400).json({ error: "Invalid provider ID" });
      }

      if (!name || !address) {
        return res.status(400).json({ error: "Name and address are required" });
      }

      try {
        const updatedProvider = await Provider.findByIdAndUpdate(
          id,
          {
            name,
            address,
            phone,
            description,
            updatedAt: new Date(),
          },
          { new: true }
        );

        if (!updatedProvider) {
          return res.status(404).json({ error: "Provider not found" });
        }

        res.status(200).json(updatedProvider);
      } catch (error) {
        console.error("Error updating provider:", error);
        res.status(500).json({ error: "Error updating provider" });
      }
      break;
    }

    case "DELETE": {
      const { id } = req.query;

      if (!mongoose.Types.ObjectId.isValid(id as string)) {
        return res.status(400).json({ error: "Invalid provider ID" });
      }

      try {
        const deletedProvider = await Provider.findByIdAndDelete(id);

        if (!deletedProvider) {
          return res.status(404).json({ error: "Provider not found" });
        }

        res.status(200).json({ message: "Provider deleted successfully" });
      } catch (error) {
        console.error("Error deleting provider:", error);
        res.status(500).json({ error: "Error deleting provider" });
      }
      break;
    }

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
