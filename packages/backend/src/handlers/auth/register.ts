import { APIGatewayProxyHandler } from "aws-lambda";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../../lib/hash";

const prisma = new PrismaClient();

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    if (!event.body) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing body" }) };
    }

    const { name, email, password } = JSON.parse(event.body);

    if (!name || !email || !password) {
      return { statusCode: 400, body: JSON.stringify({ error: "name, email, password required" }) };
    }

    // Check existing agent
    const existing = await prisma.agent.findUnique({ where: { email } });
    if (existing) {
      return { statusCode: 409, body: JSON.stringify({ error: "Email already registered" }) };
    }

    // If not, hash the password
    const hashed = await hashPassword(password);

    // Create an agent in db
    const agent = await prisma.agent.create({
      data: { name, email, password: hashed, role: "AGENT" }, //revert this to role:AGENT!!!
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    return {
      statusCode: 201,
      body: JSON.stringify({ agent }),
    };
  } catch (err) {
    console.error("register error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "server error" }) };
  } finally {
    // do not prisma.$disconnect() here in serverless dev to reuse connection; fine for local dev
  }
};
