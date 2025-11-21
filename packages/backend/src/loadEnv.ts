import path from "path";
import dotenv from "dotenv";

const envPath = path.join(__dirname, "..", ".env");
dotenv.config({ path: envPath });

console.log("Env loaded from:", envPath);