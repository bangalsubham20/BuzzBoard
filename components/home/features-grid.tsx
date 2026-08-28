"use client";

import { motion } from "framer-motion";

const features = [
    {
        title: "Discover Events",
        desc: "From hackathons to cultural fests, find events that match your passion.",
        icon: (
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
        )
    },
    {
        title: "Smart Registration",
        desc: "One-click registration and digital tickets for all college activities.",
        icon: <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    },
    {
        title: "Real-time Access",
        desc: "Instant updates and QR code scanning for seamless attendance management.",
        icon: <path d="M12 2v20M2 12h20" />
    }
];

export function FeaturesGrid() {
    return (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {features.map((feature, i) => (
                <motion.div
                    key={i}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="graphic-card p-8 rounded-[2rem] relative group overflow-hidden"
                >
                    {/* Index Tag */}
                    <div className="absolute top-6 right-6 text-3xl font-black text-secondary/25 group-hover:text-secondary/50 transition-colors font-mono">
                        0{i + 1}
                    </div>

                    <div className="h-16 w-16 rounded-2xl bg-secondary/15 border border-secondary/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-secondary group-hover:text-white transition-all shadow-md shadow-secondary/10">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-primary group-hover:text-white transition-colors"
                        >
                            {feature.icon}
                        </svg>
                    </div>
                    <h3 className="text-2xl font-extrabold text-primary mb-3 tracking-tight group-hover:text-secondary transition-colors">
                        {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed font-semibold">
                        {feature.desc}
                    </p>
                </motion.div>
            ))}
        </section>
    );
}
