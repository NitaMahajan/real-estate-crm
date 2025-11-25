// packages/backend/src/lib/roleMiddleware.ts
import { APIGatewayProxyHandler, APIGatewayProxyEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import { PrismaClient } from "@prisma/client";
import { verifyAccessToken } from "./jwt";

const prisma = new PrismaClient();

/**
 * requireRole - higher order middleware
 * usage: export const handler = requireRole(['ADMIN'])(async (event, context) => {...});
 */
export const requireRole = (allowedRoles: Array<"ADMIN" | "AGENT">) => {
  return (handler: APIGatewayProxyHandler): APIGatewayProxyHandler => {
    return async (
        event: APIGatewayProxyEvent, 
        context: Context,
        callback?: (error?: any, result?: APIGatewayProxyResult) => void
    ): Promise<APIGatewayProxyResult> => {
      try {
        // 1) Extract Authorization header
        const auth = event.headers?.authorization || event.headers?.Authorization;
        if (!auth) {
          return { statusCode: 401, body: JSON.stringify({ error: "Missing Authorization header" }) };
        }

        const [scheme, token] = auth.split(" ");
        if (scheme !== "Bearer" || !token) {
          return { statusCode: 401, body: JSON.stringify({ error: "Invalid Authorization scheme" }) };
        }

        // 2) Verify token is an access token (throws if invalid)
        let payload;
        try {
          payload = verifyAccessToken(token); // throws if not access token or invalid
        } catch (err) {
          return { statusCode: 401, body: JSON.stringify({ error: "Invalid or expired access token" }) };
        }

        const userId = (payload as any).sub;
        if (!userId) {
          return { statusCode: 401, body: JSON.stringify({ error: "Invalid token payload" }) };
        }

        // 3) Fetch authoritative user & check role
        const agent = await prisma.agent.findUnique({ where: { id: userId } });
        if (!agent) {
          return { statusCode: 401, body: JSON.stringify({ error: "User not found" }) };
        }

        if (!allowedRoles.includes(agent.role as any)) {
          return { statusCode: 403, body: JSON.stringify({ error: "Forbidden - insufficient role" }) };
        }

        // 4) Attach user info to context for downstream handlers
        (context as any).user = { id: agent.id, role: agent.role, email: agent.email };

        // 5) Call the wrapped handler and make sure we return a valid APIGatewayProxyResult
        const result = await handler(event, context, callback as any);

        // If the handler returns undefined (void), normalize to 204 No Content.
        if (!result) {
            return { statusCode: 204, body: "" };
        }
        return result;
        
      } catch (err) {
        console.error("requireRole middleware error", err);
        return { statusCode: 500, body: JSON.stringify({ error: "Internal server error" }) };
      }
    };
  };
};
