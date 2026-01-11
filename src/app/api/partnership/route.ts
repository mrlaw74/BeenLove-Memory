import { db } from "@/db";
import { partnerships } from "@/db/schema";
import { partnershipSchema } from "@/lib/validations";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validatedData = partnershipSchema.parse({
            ...body,
            startDate: new Date(body.startDate),
        });

        const existing = await db.select().from(partnerships).limit(1);

        if (existing.length > 0) {
            await db
                .update(partnerships)
                .set({
                    name1: validatedData.name1,
                    email1: validatedData.email1,
                    name2: validatedData.name2,
                    email2: validatedData.email2,
                    quote: validatedData.quote,
                    startDate: validatedData.startDate,
                    updatedAt: new Date(),
                })
                .where(eq(partnerships.id, existing[0].id));
        } else {
            await db.insert(partnerships).values({
                name1: validatedData.name1,
                email1: validatedData.email1,
                name2: validatedData.name2,
                email2: validatedData.email2,
                quote: validatedData.quote,
                startDate: validatedData.startDate,
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("POST /api/partnership error:", error);
        return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
}
