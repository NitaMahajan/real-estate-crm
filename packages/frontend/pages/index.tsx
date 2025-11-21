import { createCustomer } from "utils/api";

let exampleData = {"name":"Gaurav Patil","email":"mastergauravpatil@gmail.com","phone":"+919619534989"};

export default function Home() {
    return (
      <main style={{ padding: 24 }}>
        <h1>Real Estate CRM — Frontend</h1>
        <p>Welcome! Your Next.js frontend is running.</p>
        <button onClick={() => createCustomer(exampleData)}>Create Customer</button>
      </main>
    );
  }