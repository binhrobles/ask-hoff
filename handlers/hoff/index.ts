import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
  // @ts-ignore imports
} from "https://deno.land/x/lambda/mod.ts";

const { MS_SECRET, GIPHY_TOKEN } = Deno.env.toObject();

// deno-lint-ignore require-await
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return {
    statusCode: 200,
    headers: { "content-type": "text/html;charset=utf8" },
    body: `Welcome to deno ${Deno.version.deno} 🦕`,
  };
}
