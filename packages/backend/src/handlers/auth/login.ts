import { APIGatewayProxyHandler } from "aws-lambda";
import { PrismaClient } from "@prisma/client";
import { comparePasswords } from "../../lib/hash";
import { signAccessToken, signRefreshToken } from "../../lib/jwt";

const prisma = new PrismaClient();

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    if (!event.body) return { statusCode: 400, body: JSON.stringify({ error: "Missing body" }) };

    // Check if request has email and password
    const { email, password } = JSON.parse(event.body);
    if (!email || !password) return { statusCode: 400, body: JSON.stringify({ error: "email & password required" }) };

    // Check if user with email exists
    const agent = await prisma.agent.findUnique({ where: { email } });
    if (!agent || !agent.password) return { statusCode: 401, body: JSON.stringify({ error: "Invalid credentials" }) };

    // Compare the password passed in request with hashed password stored in db
    const ok = await comparePasswords(password, agent.password);
    if (!ok) return { statusCode: 401, body: JSON.stringify({ error: "Invalid credentials" }) };

    // sign tokens
    const payload = { sub: agent.id, role: agent.role, email: agent.email };
    const accessToken = signAccessToken(payload); // now includes typ: "access"
    const refreshToken = signRefreshToken({ sub: agent.id }); // typ: "refresh"

    // Optionally persist refreshToken (for revoke)
    await prisma.agent.update({ where: { id: agent.id }, data: { token: refreshToken } });

    // Return tokens in body (for local dev). For better security, set HttpOnly cookie instead.
    return {
      statusCode: 200,
      body: JSON.stringify({
        accessToken,
        refreshToken,
        user: { id: agent.id, name: agent.name, email: agent.email, role: agent.role },
      }),
    };
  } catch (err) {
    console.error("login error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "server error" }) };
  }
};
