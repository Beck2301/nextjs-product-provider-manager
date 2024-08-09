import type { NextApiRequest, NextApiResponse } from "next";
import Provider from "../../../models/Provider";
import { connectToDatabase } from "../../../utils/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();

  const { id } = req.query;

  switch (req.method) {
    case "GET":
      try {
        const provider = await Provider.findById(id);
        if (!provider) {
          return res.status(404).json({ error: "Provider not found" });
        }
        res.status(200).json(provider);
      } catch (error) {
        res.status(500).json({ error: "Error fetching provider" });
      }
      break;
    case "PUT":
      try {
        const updatedProvider = await Provider.findByIdAndUpdate(id, req.body, {
          new: true,
        });
        if (!updatedProvider) {
          return res.status(404).json({ error: "Provider not found" });
        }
        res.status(200).json(updatedProvider);
      } catch (error) {
        res.status(500).json({ error: "Error updating provider" });
      }
      break;
    case "DELETE":
      try {
        const deletedProvider = await Provider.findByIdAndDelete(id);
        if (!deletedProvider) {
          return res.status(404).json({ error: "Provider not found" });
        }
        res.status(204).end();
      } catch (error) {
        res.status(500).json({ error: "Error deleting provider" });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
