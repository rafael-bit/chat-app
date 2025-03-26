import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
	throw new Error("Defina a variável de ambiente MONGO_URL");
}

export const connectDB = async () => {
	if (mongoose.connection.readyState >= 1) {
		return;
	}
	await mongoose.connect(MONGO_URL);
};
