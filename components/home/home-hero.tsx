"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HomeHero() {
    return (
        <section className="relative py-20 md:py-32 overflow-hidden rounded-3xl mb-16">
            <div className="absolute inset-0 bg-primary/5 -z-10 blur-3xl opacity-50" />
            <div className="container px-4 md:px-6 relative z-10">
                <div className="flex flex-col items-center justify-center space-y-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-4"
                    >
                        <Badge variant="outline" className="px-4 py-1 text-primary border-primary/20 bg-white/50 backdrop-blur-sm rounded-full">
                            Campus Life Reimagined
                        </Badge>
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                            <span className="block text-primary">JIS College</span>
                            <span className="text-gradient">BuzzBoard</span>
                        </h1>
                        <p className="mx-auto max-w-[800px] text-gray-600 md:text-xl/relaxed lg:text-2xl/relaxed font-medium">
                            Your hub for discovery, connection, and growth. Stay updated with the pulse of JIS College of Engineering.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="flex flex-wrap items-center justify-center gap-6"
                    >
                        <Link href="/events">
                            <Button size="lg" className="h-14 px-8 text-lg bg-primary hover:bg-secondary shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                                Explore Events
                            </Button>
                        </Link>
                        <Link href="/auth/register">
                            <Button size="lg" variant="outline" className="h-14 px-8 text-lg glass border-primary/10 text-primary transition-all hover:scale-105 active:scale-95">
                                Join Community
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
