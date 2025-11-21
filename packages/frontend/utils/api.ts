export async function createCustomer(data: any) {
    console.log("Creating customer with data:", data);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }