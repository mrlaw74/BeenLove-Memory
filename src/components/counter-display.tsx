"use client";

import { useEffect, useState } from "react";
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from "date-fns";
import { motion } from "framer-motion";

interface CounterDisplayProps {
    startDate: Date;
}

export function CounterDisplay({ startDate }: CounterDisplayProps) {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const totalDays = differenceInDays(now, startDate);
    const hours = differenceInHours(now, startDate) % 24;
    const minutes = differenceInMinutes(now, startDate) % 60;
    const seconds = differenceInSeconds(now, startDate) % 60;

    return (
        <div className="flex flex-col items-center gap-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <h2 className="text-6xl font-black text-pink-600 tracking-tight">
                    {totalDays} Days
                </h2>
                <p className="text-muted-foreground mt-2 font-medium uppercase tracking-widest">
                    Together Forever
                </p>
            </motion.div>

            <div className="grid grid-cols-3 gap-4 text-center">
                {[
                    { label: "Hours", value: hours },
                    { label: "Minutes", value: minutes },
                    { label: "Seconds", value: seconds },
                ].map((item, idx) => (
                    <motion.div
                        key={item.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex flex-col bg-white/50 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-pink-100 min-w-[100px]"
                    >
                        <span className="text-2xl font-bold text-pink-500">{item.value}</span>
                        <span className="text-xs text-muted-foreground uppercase">{item.label}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
