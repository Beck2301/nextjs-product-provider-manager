import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "";

if (!MONGO_URI) {
  throw new Error(
    "Please define the MONGO_URI environment variable inside .env.local"
  );
}

let cachedClient: mongoose.Mongoose | null = null;

export async function connectToDatabase() {
  if (cachedClient) {
    console.log("Usando cliente MongoDB en caché");
    return cachedClient;
  }

  try {
    console.log("Intentando conectar a MongoDB...");

    mongoose.connection.on("connected", () => {
      console.log("Mongoose connected to", MONGO_URI);
    });

    mongoose.connection.on("error", (err) => {
      console.error("Mongoose connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose disconnected");
    });

    const client = await mongoose.connect(MONGO_URI);

    cachedClient = client;

    console.log("Conexión a MongoDB exitosa");
    return client;
  } catch (error) {
    console.error("Error conectando a MongoDB:", error);
    throw new Error("No se pudo conectar a MongoDB");
  }
}
