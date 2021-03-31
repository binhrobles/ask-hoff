import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  // @ts-ignore imports
} from "https://deno.land/x/lambda/mod.ts";
import { hmac } from "https://deno.land/x/god_crypto/hmac.ts";

const { MS_SECRET, GIPHY_TOKEN } = Deno.env.toObject();
const MS_SECRET_UTF = atob(MS_SECRET);

export async function handler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  try {
    // Retrieve authorization HMAC information
    const auth = event.headers.Authorization;

    // Calculate HMAC on the message we've received using the shared secret
    const encoder = new TextEncoder();
    const msgBuff = encoder.encode(event.body || "");
    const msgHash = `HMAC ${hmac("sha256", MS_SECRET_UTF, msgBuff).base64()}`;

    if (auth !== msgHash) {
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
    if (randomNum < 0.3) {
      tone = "positive";
      answer = "The Hoff thinks yes!";
    } else if (randomNum >= 0.3 || randomNum < 0.6) {
      tone = "unsure";
      answer = "Hoff's not sure.";
    } else if (randomNum >= 0.6 || randomNum < 0.9) {
      tone = "negative";
      answer = "That's a no from the Hoff.";
    } else if (randomNum >= 0.9) {
      tone = "thoughtful";
      answer = "The Hoff needs you to come back later, skater.";
    }

    const offset = Math.floor(Math.random() * 10);
    const res = await fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_TOKEN}&q=${tone} hasselhoff&limit=1&offset=${offset}&rating=g&lang=en`,
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
  } catch (err) {
    console.error(err.message);
    return {
      statusCode: 400,
      body: JSON.stringify({
        type: "message",
        text: err.message,
      }),
    };
  }
}
