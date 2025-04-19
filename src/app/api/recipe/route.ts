import { NextResponse } from "next/server";
import OpenAI from "openai";
import { MongoClient, ObjectId } from "mongodb";
import { AccuracyFoodGptRequest } from "@/app/entities/AccuracyFoodEntity";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const client = new MongoClient(process.env.MONGO_URI || "");

export async function POST(request: Request) {
  try {
    const body: AccuracyFoodGptRequest = await request.json();

    const { imageBase64, recipeName, recipeIngredients, moreDetails } = body;

    if (!imageBase64 || !recipeName || !recipeIngredients) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const ingredientList = recipeIngredients
      .map(
        (i) =>
          `- ${i.igredientName}${
            i.igredientUnit ? ` (${i.quantity || ''} ${i.igredientUnit})` : ""
          }`
      )
      .join("\n");

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze the following food image based on the provided recipe context.

Recipe Name: ${recipeName}

Ingredients:
${ingredientList}

Return a JSON object with *only* this format (and nothing else):

{
  "foodName": "name of the food",
  "calories": number,
  "proteins": number,
  "fats": number,
  "recipeName": "${recipeName}",
  "ingredients": ${JSON.stringify(recipeIngredients)}
}

Be as precise as possible in estimating calories, proteins, and fats, considering both the image and the provided ingredients. When quantities are provided, use them to calculate the nutritional values more accurately.

${moreDetails ? `Additional details: ${moreDetails}` : ""}`,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
      temperature: 0.5,
    });

    const aiResult = response.choices[0]?.message?.content;
    if (!aiResult) {
      return NextResponse.json(
        { error: "No content returned by model" },
        { status: 500 }
      );
    }

    const cleanedJson = aiResult
      .trim()
      .replace(/^```json|^```|```$/g, "")
      .trim();

    const analysisResult = JSON.parse(cleanedJson);

    const foodEntity = {
      id: new ObjectId().toString(),
      ...analysisResult,
      image: imageBase64,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await client.connect();
    const db = client.db();
    const collection = db.collection("recipes");
    await collection.insertOne(foodEntity);

    return NextResponse.json({ data: analysisResult }, { status: 200 });
  } catch (error) {
    console.error("Error analyzing food image:", error);
    return NextResponse.json(
      { error: "Failed to analyze food image" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export async function GET() {
  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection("recipes");

    const foods = await collection.find({}).toArray();

    return NextResponse.json(foods);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
