import { APIGatewayProxyHandler } from "aws-lambda";
import { verifyAccessToken } from "../../lib/jwt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const auth = event.headers?.Authorization;
    if (!auth) return { statusCode: 401, body: JSON.stringify({ error: "Unauthorized" }) };

    const parts = auth.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") return { statusCode: 401, body: JSON.stringify({ error: "Unauthorized" }) };

    const token = parts[1];
    const payload = verifyAccessToken(token);
    const userId = payload.sub;

    const user = await prisma.agent.findUnique({ where: { id: userId }, select: { id: true, name: true, email: true, role: true } });
    if (!user) return { statusCode: 404, body: JSON.stringify({ error: "User not found" }) };

    return { statusCode: 200, body: JSON.stringify({ user }) };
  } catch (err) {
    console.error("me error:", err);
    return { statusCode: 401, body: JSON.stringify({ error: "Invalid token" }) };
  }
};
