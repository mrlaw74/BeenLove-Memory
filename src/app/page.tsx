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
  const result = await db.select().from(partnerships).limit(1);
  const partnership = result[0];

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
