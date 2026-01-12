import { db } from "@/db";
import { memories } from "@/db/schema";
import { memorySchema } from "@/lib/validations";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { nanoid } from "nanoid";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const memory = await db
            .select()
            .from(memories)
            .where(eq(memories.id, id))
            .limit(1);

        if (memory.length === 0) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json(memory[0]);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const formData = await req.formData();
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const date = new Date(formData.get("date") as string);
        const file = formData.get("image") as File;

        const validatedData = memorySchema.parse({ title, description, date });

        const existing = await db
            .select()
            .from(memories)
            .where(eq(memories.id, id))
            .limit(1);

        if (existing.length === 0) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        let imageUrl = existing[0].imageUrl;
        if (file && file.size > 0) {
            // Create new image
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const extension = file.name.split('.').pop();
            const fileName = `${nanoid()}.${extension}`;
            const path = join(process.cwd(), "public", "uploads", fileName);

            await writeFile(path, buffer);

            // Delete old local image if it exists
            if (imageUrl && imageUrl.startsWith("/uploads/")) {
                const oldImagePath = join(process.cwd(), "public", imageUrl);
                try {
                    await unlink(oldImagePath);
                } catch (e) {
                    console.error("Failed to delete old local image", e);
                }
            }

            imageUrl = `/uploads/${fileName}`;
        }

        await db
            .update(memories)
            .set({
                title: validatedData.title,
                description: validatedData.description,
                date: validatedData.date,
                imageUrl,
            })
            .where(eq(memories.id, id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("PATCH /api/memories/[id] error:", error);
        return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Get image URL to delete from local storage
        const existing = await db
            .select()
            .from(memories)
            .where(eq(memories.id, id))
            .limit(1);

        if (existing.length > 0 && existing[0].imageUrl && existing[0].imageUrl.startsWith("/uploads/")) {
            const imagePath = join(process.cwd(), "public", existing[0].imageUrl);
            try {
                await unlink(imagePath);
            } catch (e) {
                console.error("Failed to delete image from local storage", e);
            }
        }

        await db.delete(memories).where(eq(memories.id, id));
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
