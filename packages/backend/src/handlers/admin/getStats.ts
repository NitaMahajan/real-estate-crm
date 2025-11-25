import { APIGatewayProxyHandler } from "aws-lambda";
import { requireRole } from "../../lib/roleMiddleware";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handlerImpl: APIGatewayProxyHandler = async (event, context) => {
  // (context as any).user available
  const totalAgents = await prisma.agent.count();
  const totalCustomers = await prisma.customer.count();
  const totalInventory = await prisma.inventoryUnit.count();

  return {
    statusCode: 200,
    body: JSON.stringify({
      totalAgents,
      totalCustomers,
      totalInventory,
      requestedBy: (context as any).user,
    }),
  };
};

// only ADMINs can access
export const handler = requireRole(["ADMIN"])(handlerImpl);
