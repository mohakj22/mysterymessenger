/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable */
// Disables all ESLint rules

/* tslint:disable */
// Disables TSLint rules if you're using TSLint

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    // console.log("Already connected to the DB");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_DB_URI || "");
    connection.isConnected = db.connection.readyState;
    // console.log("DB Connected");
  } catch (error) {
    // console.error("DB connection failed!", error);
    process.exit(1);
  }
}

export default dbConnect;
