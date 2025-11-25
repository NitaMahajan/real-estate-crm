"use client";
import { createCustomer } from "utils/api";

const exampleData = {
  name: "Gaurav Patil",
  email: "mastergauravpatil@gmail.com",
  phone: "+919619534989",
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        Real Estate CRM — Frontend
      </h1>

      <p className="text-gray-600 mb-6">
        Welcome! Your Next.js frontend is running.
      </p>

      <button
        onClick={() => createCustomer(exampleData)}
        className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
      >
        Create Customer
      </button>
    </div>
  );
}
