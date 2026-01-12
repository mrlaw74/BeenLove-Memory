import { db } from "@/db";
import { partnerships } from "@/db/schema";
import { HeartAnimation } from "@/components/heart-animation";
import { CounterDisplay } from "@/components/counter-display";
import { QuoteDisplay } from "@/components/quote-display";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Settings, Heart } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let partnership;

  try {
    const result = await db.select().from(partnerships).limit(1);
    partnership = result[0];
  } catch (error) {
    console.error("Database connection error:", error);
    // If DB fails, we still want to show something or redirect to setup
    // But usually, a DB failure should be handled gracefully
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Database Connection Error</h1>
        <p className="text-muted-foreground mb-4">
          We couldn't connect to the database. Detailed error:
        </p>
        <div className="bg-red-50 p-4 rounded-xl mb-8 font-mono text-sm inline-block text-red-700 max-w-2xl overflow-auto border border-red-100">
          {(error as Error).message || "Unknown error"}
        </div>
        <p className="text-sm text-muted-foreground mb-8">
          Check your <strong>DATABASE_URL</strong> in Vercel Settings.
        </p>
        <Button asChild>
          <Link href="/setup">Try Setup Page</Link>
        </Button>
      </div>
    );
  }

  if (!partnership) {
    redirect("/setup");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 space-y-12">
      <div className="flex items-center gap-8 md:gap-16">
        <div className="text-right">
          <h1 className="text-4xl md:text-6xl font-heading font-black text-pink-600">
            {partnership.name1}
          </h1>
          <p className="text-muted-foreground uppercase tracking-widest text-sm">Lover</p>
        </div>

        <HeartAnimation />

        <div className="text-left">
          <h1 className="text-4xl md:text-6xl font-heading font-black text-pink-600">
            {partnership.name2}
          </h1>
          <p className="text-muted-foreground uppercase tracking-widest text-sm">Lover</p>
        </div>
      </div>

      <CounterDisplay startDate={partnership.startDate} />

      {partnership.quote && <QuoteDisplay quote={partnership.quote} />}

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
        <Button asChild variant="outline" className="bg-white/50 backdrop-blur-md rounded-full px-6 border-pink-100">
          <Link href="/setup">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </Button>
        <Button asChild className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-6 shadow-lg shadow-pink-200">
          <Link href="/memories">
            <Heart className="mr-2 h-4 w-4" />
            Memories
          </Link>
        </Button>
      </div>
    </main>
  );
}
