console.log("DEBUG MONGODB_URI:", process.env.MONGODB_URI);

import mongoose from "mongoose";

export const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI não está definido no .env");
  }

  await mongoose.connect(MONGODB_URI);
  console.log("MongoDB conectado com sucesso!");
};

connectDB(); // executa automaticamente
