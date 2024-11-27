import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

// Path to your Firebase service account JSON file
const serviceAccountPath = path.resolve(
  "E:\\just college things\\video streaming app\\another-one\\server\\video-streaming-9b69a-firebase-adminsdk-vppac-53ef2b3e55.json"
);

// Initialize Firebase Admin
initializeApp({
  credential: cert(serviceAccountPath),
});

// Firestore database reference
const db = getFirestore();

// Export the db and other Firebase services as needed
export default db;
