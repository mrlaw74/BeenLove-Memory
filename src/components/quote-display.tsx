"use client";

import { motion } from "framer-motion";

interface QuoteDisplayProps {
    quote: string;
}

export function QuoteDisplay({ quote }: QuoteDisplayProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="max-w-md text-center px-4"
        >
            <p className="text-xl italic text-pink-500/80 font-medium leading-relaxed">
                "{quote}"
            </p>
        </motion.div>
    );
}
