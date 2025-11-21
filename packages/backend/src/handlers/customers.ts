import "../loadEnv";
import { APIGatewayProxyHandler } from "aws-lambda";

export const create: APIGatewayProxyHandler = async (event) => {
  const body = event.body ? JSON.parse(event.body) : {};
  // stubbed: replace with DB write in next story
  return {
    statusCode: 201,
    body: JSON.stringify({ id: "local-1", ...body }),
  };
};
