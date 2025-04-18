import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ScanFoodEntity } from "@/app/entities/ScanFoodEntity";
import { MongoClient, ObjectId } from "mongodb";
import {
  FoodAnalysisRequest,
  FoodAnalysisResponse,
} from "@/app/entities/ScanFoodEntity";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const client = new MongoClient(process.env.MONGO_URI || "");

export async function GET() {
  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection("food");

    const foods = await collection.find({}).toArray();

    return NextResponse.json(foods);
  } catch (error) {
    console.error("Error fetching foods:", error);
    return NextResponse.json(
      { error: "Failed to fetch foods" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export async function POST(request: Request) {
  try {
    const body: FoodAnalysisRequest = await request.json();

    if (!body.imageBase64) {
      return NextResponse.json(
        { error: "Image data is required" },
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: 'Analyze this food image and return a JSON object with exactly this format, nothing else: {"foodName": "name of the food", "calories": number, "proteins": number, "fats": number}. Be precise with the calories estimation.',
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${body.imageBase64}`,
              },
            },
          ],
        },
      ],
      temperature: 0.5,
    });

    const content = response.choices[0].message.content || "{}";
    const cleanContent = content.replace(/```json\n?|\n?```/g, "").trim();

    const analysisResult = JSON.parse(cleanContent);

    if (
      !analysisResult.foodName ||
      typeof analysisResult.calories !== "number"
    ) {
      return NextResponse.json(
        { error: "Invalid analysis result" },
        { status: 500 }
      );
    }

    const foodEntity: ScanFoodEntity = {
      id: new ObjectId().toString(),
      foodName: analysisResult.foodName,
      calories: analysisResult.calories,
      proteins: analysisResult.proteins,
      fats: analysisResult.fats,
      image: body.imageBase64,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await client.connect();
    const db = client.db();
    const collection = db.collection("food");
    await collection.insertOne(foodEntity);

    const foodAnalysis: FoodAnalysisResponse = {
      foodName: analysisResult.foodName,
      calories: analysisResult.calories,
      proteins: analysisResult.proteins,
      fats: analysisResult.fats,
    };

    return NextResponse.json(foodAnalysis);
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
