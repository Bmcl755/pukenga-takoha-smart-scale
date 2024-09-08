import mongoose from "mongoose";

const connectDb = async (uri: string) => {
  const db = mongoose.connection;

  db.on("connected", () => {
    console.log("Connected to MongoDB");
  });

  db.on("error", (err: Error) => {
    console.error("Error connecting to MongoDB:", err);
  });

  db.on("disconnected", () => {
    console.log("Disconnected from MongoDB");
  });

  process.on("SIGINT", () => {
    db.close(undefined);
    console.log("MongoDB connection closed");
    process.exit(0);
  });

  await mongoose.connect(uri);
};

export default connectDb;
