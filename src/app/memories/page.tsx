import { db } from "@/db";
import { memories } from "@/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import Image from "next/image";
import { Plus, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { desc } from "drizzle-orm";

export default async function MemoriesPage() {
    const allMemories = await db.select().from(memories).orderBy(desc(memories.date));

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-heading font-black text-pink-600">Our Memories</h1>
                    <p className="text-muted-foreground">Every moment matters</p>
                </div>
                <Button asChild className="bg-pink-500 hover:bg-pink-600 text-white rounded-full">
                    <Link href="/memories/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {allMemories.length === 0 ? (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-pink-100 rounded-3xl">
                        <p className="text-muted-foreground">No memories yet. Start by adding one!</p>
                    </div>
                ) : (
                    allMemories.map((memory) => (
                        <Card key={memory.id} className="overflow-hidden border-none shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl group">
                            {memory.imageUrl && (
                                <div className="relative h-48 w-full overflow-hidden">
                                    <Image
                                        src={memory.imageUrl}
                                        alt={memory.title}
                                        fill
                                        className="object-cover transition-transform group-hover:scale-105"
                                    />
                                </div>
                            )}
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <CardTitle className="text-xl font-bold">{memory.title}</CardTitle>
                                        <span className="text-xs font-medium text-pink-500 mt-1">
                                            {format(memory.date, "MMM d, yyyy")}
                                        </span>
                                    </div>
                                    <Button asChild variant="ghost" size="icon" className="hover:text-pink-600 hover:bg-pink-50 rounded-full">
                                        <Link href={`/memories/${memory.id}/edit`}>
                                            <Edit2 className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground line-clamp-3">{memory.description}</p>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            <div className="text-center pb-10">
                <Button asChild variant="ghost" className="text-pink-500">
                    <Link href="/">← Back to Counter</Link>
                </Button>
            </div>
        </div>
    );
}
