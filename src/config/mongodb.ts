import mongoose from "mongoose";

export const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    throw new Error("MONGO_URI não está definido no .env");
  }

  await mongoose.connect(MONGO_URI);
  console.log("MongoDB conectado com sucesso!");
};

connectDB(); // executa automaticamente
