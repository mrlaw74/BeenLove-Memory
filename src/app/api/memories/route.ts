import { db } from "@/db";
import { memories, partnerships } from "@/db/schema";
import { memorySchema } from "@/lib/validations";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const date = new Date(formData.get("date") as string);
        const file = formData.get("image") as File;

        const validatedData = memorySchema.parse({ title, description, date });

        const partnershipResult = await db.select().from(partnerships).limit(1);
        if (partnershipResult.length === 0) {
            return NextResponse.json({ error: "No partnership found" }, { status: 404 });
        }

        let imageUrl = null;
        if (file && file.size > 0) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Create a unique filename
            const extension = file.name.split('.').pop();
            const fileName = `${nanoid()}.${extension}`;
            const path = join(process.cwd(), "public", "uploads", fileName);

            await writeFile(path, buffer);
            imageUrl = `/uploads/${fileName}`;
        }

        await db.insert(memories).values({
            partnershipId: partnershipResult[0].id,
            title: validatedData.title,
            description: validatedData.description,
            date: validatedData.date,
            imageUrl,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("POST /api/memories error:", error);
        return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
}

export async function GET() {
    try {
        const allMemories = await db.select().from(memories).orderBy(memories.date);
        return NextResponse.json(allMemories);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}
