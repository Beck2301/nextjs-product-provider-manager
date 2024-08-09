import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "";

if (!MONGO_URI) {
  throw new Error(
    "Please define the MONGO_URI environment variable inside .env.local"
  );
}

let cachedClient: mongoose.Mongoose | null = null;

export async function connectToDatabase() {
  // Log para verificar si la URI está presente
  console.log("MONGO_URI:", MONGO_URI);

  if (cachedClient) {
    console.log("Usando cliente MongoDB en caché");
    return cachedClient;
  }

  try {
    console.log("Intentando conectar a MongoDB...");
    const client = await mongoose.connect(MONGO_URI);

    cachedClient = client;

    console.log("Conexión a MongoDB exitosa");
    return client;
  } catch (error) {
    console.error("Error conectando a MongoDB:", error);
    throw new Error("No se pudo conectar a MongoDB");
  }
}
