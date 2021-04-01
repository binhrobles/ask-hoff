import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  // @ts-ignore imports
} from "https://deno.land/x/lambda/mod.ts";
import { hmac } from "https://deno.land/x/god_crypto/hmac.ts";
import {
  // deno-lint-ignore camelcase
  base64_to_binary,
  str2bytes,
} from "https://deno.land/x/god_crypto/src/helper.ts";

export const isValidHMAC = ({
  authHeader,
  body,
  base64secret,
}: { authHeader: string; body: string; base64secret: string }): boolean => {
  try {
    const secret = base64_to_binary(base64secret);

    // Calculate HMAC on the message we've received using the shared secret
    const msgBuff = str2bytes(body);
    const msgHash = `HMAC ${hmac("sha256", secret, msgBuff).base64()}`;

    // Compare our HMAC w/ the one the sender attached
    return authHeader === msgHash;
  } catch (err) {
    console.error(err.message);
    return false;
  }
};

export async function handler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  const { MS_SECRET, GIPHY_TOKEN } = Deno.env.toObject();

  if (
    !isValidHMAC({
      authHeader: event.headers.Authorization,
      body: event.body || "",
      base64secret: MS_SECRET,
    })
  ) {
    console.error("Failed message authentication");
    return {
      statusCode: 403,
      body: JSON.stringify({
        type: "message",
        text: "Error: message sender cannot be authenticated",
      }),
    };
  }

  let tone;
  let answer;
  const randomNum = Math.random();
  if (randomNum < 0.45) {
    tone = "positive";
    answer = "The Hoff thinks yes!";
  } else if (randomNum >= 0.45 || randomNum < 0.9) {
    tone = "negative";
    answer = "That's a no from the Hoff.";
  } else if (randomNum >= 0.9 || randomNum < 0.95) {
    tone = "unsure";
    answer = "Hoff's not sure.";
  } else if (randomNum >= 0.95) {
    tone = "thoughtful";
    answer = "The Hoff needs you to come back later, skater.";
  }

  const offset = Math.floor(Math.random() * 10).toString();
  const params = {
    // deno-lint-ignore camelcase
    api_key: GIPHY_TOKEN,
    q: `${tone} hasselhoff`,
    limit: "1",
    rating: "g",
    lang: "en",
    offset,
  };
  const res = await fetch(
    `https://api.giphy.com/v1/gifs/search?${
      new URLSearchParams(params).toString()
    }`,
  );
  const json = await res.json();
  const imageInfo = json.data[0].images.original;

  return {
    statusCode: 200,
    body: JSON.stringify({
      type: "AdaptiveCard",
      text:
        `${answer}<br/><img src="${imageInfo.url}" height="${imageInfo.height}" width="${imageInfo.width}"></img>`,
    }),
  };
}
