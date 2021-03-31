import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
  // @ts-ignore imports
} from "https://deno.land/x/lambda/mod.ts";

const { MS_SECRET, GIPHY_TOKEN } = Deno.env.toObject();
const MS_SECRET_UTF = atob(MS_SECRET);

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  try {
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
