"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HomeHero() {
    return (
        <section className="relative py-12 sm:py-20 md:py-28 px-2 sm:px-4 overflow-hidden rounded-3xl sm:rounded-[2.5rem] mb-12 md:mb-16 graphic-card border-secondary/30">
            {/* Ambient Graphic Orbs */}
            <div className="absolute -top-24 -left-24 w-72 md:w-96 h-72 md:h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-72 md:w-96 h-72 md:h-96 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />
            
            <div className="container px-3 sm:px-6 relative z-10">
                <div className="flex flex-col items-center justify-center space-y-6 md:space-y-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-4 md:space-y-5 flex flex-col items-center"
                    >
                        <div className="inline-flex items-center gap-1.5 md:gap-2 px-3.5 md:px-5 py-1.5 rounded-full graphic-badge text-[10px] sm:text-xs md:text-sm tracking-wider shadow-sm max-w-full truncate">
                            <span className="text-secondary text-xs sm:text-base">✦</span>
                            <span className="truncate">Campus Events & Community Hub</span>
                            <span className="text-secondary text-xs sm:text-base">✦</span>
                        </div>
                        
                        <h1 className="text-3xl font-black tracking-tight sm:text-6xl md:text-7xl lg:text-8xl leading-none">
                            <span className="block text-primary drop-shadow-sm">JIS College</span>
                            <span className="text-gradient drop-shadow-md">BuzzBoard</span>
                        </h1>
                        
                        <p className="mx-auto max-w-[760px] text-gray-700 text-base sm:text-xl/relaxed lg:text-2xl/relaxed font-semibold leading-relaxed px-2">
                            Discover campus fests, workshops, and student hubs. One-click registration and smart digital passes for JIS College of Engineering.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 pt-2 w-full sm:w-auto"
                    >
                        <Link href="/events" className="w-full sm:w-auto">
                            <Button size="lg" className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-9 text-base sm:text-lg bg-primary hover:bg-secondary text-white shadow-graphic rounded-2xl transition-all hover:scale-105 active:scale-95 font-extrabold tracking-wide">
                                Explore Fests & Events ➔
                            </Button>
                        </Link>
                        <Link href="/auth/register" className="w-full sm:w-auto">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-9 text-base sm:text-lg graphic-card border-primary/20 text-primary hover:border-secondary hover:text-secondary rounded-2xl transition-all hover:scale-105 active:scale-95 font-extrabold">
                                Join Student Community
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Graphic Quick Stats Banner */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="pt-6 md:pt-8 border-t border-primary/10 w-full max-w-3xl grid grid-cols-3 gap-2 sm:gap-4 text-center mt-4 sm:mt-6"
                    >
                        <div>
                            <p className="text-xl sm:text-3xl md:text-4xl font-black text-primary">50+</p>
                            <p className="text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider text-gray-600 mt-1">Campus Events</p>
                        </div>
                        <div className="border-x border-primary/10 px-1 sm:px-2">
                            <p className="text-xl sm:text-3xl md:text-4xl font-black text-secondary">2,500+</p>
                            <p className="text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider text-gray-600 mt-1">Active Students</p>
                        </div>
                        <div>
                            <p className="text-xl sm:text-3xl md:text-4xl font-black text-primary">100%</p>
                            <p className="text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider text-gray-600 mt-1">Instant Passes</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
