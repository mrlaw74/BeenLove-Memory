"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export function HeartAnimation() {
    return (
        <div className="relative flex items-center justify-center w-64 h-64">
            {/* Pulse Rings */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                }}
                className="absolute w-32 h-32 bg-pink-500 rounded-full"
            />
            <motion.div
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: 1.2, opacity: 0 }}
                transition={{
                    duration: 2,
                    delay: 0.5,
                    repeat: Infinity,
                    ease: "easeOut",
                }}
                className="absolute w-32 h-32 bg-pink-400 rounded-full"
            />

            {/* Main Heart */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="relative z-10"
            >
                <Heart className="w-32 h-32 text-pink-500 fill-pink-500 drop-shadow-2xl" />
            </motion.div>
        </div>
    );
}
