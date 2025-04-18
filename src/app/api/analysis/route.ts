import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI || "");

export async function GET() {
  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection("recipes");

    // Calculate date for 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Aggregate pipeline to group by day and calculate totals
    const pipeline = [
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt"
            }
          },
          totalCalories: { $sum: "$calories" },
          totalProteins: { $sum: "$proteins" },
          totalFats: { $sum: "$fats" }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ];

    const results = await collection.aggregate(pipeline).toArray();

    // Format the response
    const formattedResults = results.map(day => ({
      date: day._id,
      totalCalories: Math.round(day.totalCalories),
      totalProteins: Math.round(day.totalProteins),
      totalFats: Math.round(day.totalFats)
    }));

    return NextResponse.json({ data: formattedResults }, { status: 200 });
  } catch (error) {
    console.error("Error analyzing recipe data:", error);
    return NextResponse.json(
      { error: "Failed to analyze recipe data" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
