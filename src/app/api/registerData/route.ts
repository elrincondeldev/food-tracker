import { NextResponse } from "next/server";
import OpenAI from "openai";
import { MongoClient, ObjectId } from "mongodb";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const client = new MongoClient(process.env.MONGO_URI || "");

interface RegisterDataRequest {
  age: number;
  gender: "male" | "female";
  weight: number; // in kg
  height: number; // in cm
  physicalActivity: "sedentary" | "light" | "moderate" | "very" | "extra";
  goal: "lose" | "maintain" | "gain";
}

export async function POST(request: Request) {
  try {
    const body: RegisterDataRequest = await request.json();

    const { age, gender, weight, height, physicalActivity, goal } = body;

    if (!age || !gender || !weight || !height || !physicalActivity || !goal) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a nutrition expert. Respond ONLY with valid JSON, no additional text or explanations.",
        },
        {
          role: "user",
          content: `Calculate daily nutritional needs for a person with the following characteristics:
- Age: ${age} years
- Gender: ${gender}
- Weight: ${weight} kg
- Height: ${height} cm
- Physical Activity Level: ${physicalActivity}
- Goal: ${goal} weight

Return ONLY a JSON object with this exact format:
{
  "dailyCalories": number,
  "macronutrients": {
    "proteins": number,
    "carbs": number,
    "fats": number
  }
}

Use these guidelines:
- Proteins: 2g per kg of body weight
- Fats: 25% of total calories
- Carbs: Remaining calories
- Adjust calories based on goal: -500 for weight loss, +500 for weight gain
- Consider activity level in BMR calculation using Harris-Benedict equation
- Round all numbers to whole numbers

Remember: Return ONLY the JSON object, no additional text.`,
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

    const nutritionalData = JSON.parse(cleanedJson);

    // Crear la entidad para guardar en la base de datos
    const userDataEntity = {
      id: new ObjectId().toString(),
      ...body,
      nutritionalData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Guardar en la base de datos
    await client.connect();
    const db = client.db();
    const collection = db.collection("user");
    await collection.insertOne(userDataEntity);

    return NextResponse.json({ data: nutritionalData }, { status: 200 });
  } catch (error) {
    console.error("Error processing user data:", error);
    return NextResponse.json(
      { error: "Failed to process user data" },
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
    const collection = db.collection("user");

    const users = await collection.find({}).toArray();

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
