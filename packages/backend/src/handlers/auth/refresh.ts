// packages/backend/src/handlers/auth/refresh.ts
import { APIGatewayProxyHandler } from "aws-lambda";
import { PrismaClient } from "@prisma/client";
import { verifyRefreshToken, signAccessToken, signRefreshToken } from "../../lib/jwt";

const prisma = new PrismaClient();

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    // Accept refresh token in body or HttpOnly cookie; here, body for local dev
    const body = event.body ? JSON.parse(event.body) : {};
    const token = body.refreshToken || (event.headers && event.headers["x-refresh-token"]);
    if (!token) return { statusCode: 400, body: JSON.stringify({ error: "refreshToken required" }) };

    const payload = verifyRefreshToken(token);
    const agentId = payload.sub;

    // verify refresh token exists in DB and matches (revocation check)
    const agent = await prisma.agent.findUnique({ where: { id: agentId } });
    if (!agent || !agent.token) return { statusCode: 401, body: JSON.stringify({ error: "Invalid refresh token" }) };
    if (agent.token !== token) {
      return { statusCode: 401, body: JSON.stringify({ error: "Refresh token revoked" }) };
    }

    // rotate refresh token (optional but recommended)
    const newAccess = signAccessToken({ sub: agent.id, role: agent.role, email: agent.email });
    const newRefresh = signRefreshToken({ sub: agent.id });
    await prisma.agent.update({ where: { id: agent.id }, data: { token: newRefresh } });

    return { statusCode: 200, body: JSON.stringify({ accessToken: newAccess, refreshToken: newRefresh }) };
  } catch (err) {
    console.error("refresh error:", err);
    return { statusCode: 401, body: JSON.stringify({ error: "Invalid refresh token" }) };
  }
};
