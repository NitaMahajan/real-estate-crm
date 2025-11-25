// packages/backend/src/lib/authMiddleware.ts
import { verifyAccessToken } from "./jwt";
import { APIGatewayProxyHandler } from "aws-lambda";

export const withAuth = (handler: APIGatewayProxyHandler): APIGatewayProxyHandler => {
  return async (event, context, callback) => {
    try {
      const auth = event.headers?.authorization;
      if (!auth) return { statusCode: 401, body: JSON.stringify({ error: "Missing auth" }) };
      const [scheme, token] = auth.split(" ");
      if (scheme !== "Bearer" || !token) return { statusCode: 401, body: JSON.stringify({ error: "Invalid auth" }) };

      const payload = verifyAccessToken(token);

      // attach user id/role to context for downstream handlers
      (context as any).user = { id: payload.sub, role: payload.role, email: payload.email };

      const result = await handler(event, context, callback);

      return result ?? { statusCode: 200, body: "" };
    } catch (err) {
      return { statusCode: 401, body: JSON.stringify({ error: "Unauthorized" }) };
    }
  };
};
