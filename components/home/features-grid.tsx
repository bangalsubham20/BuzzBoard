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
                    whileHover={{ y: -5 }}
                    className="glass p-8 rounded-3xl transition-all hover:shadow-2xl hover:shadow-primary/5 group"
                >
                    <div className="h-14 w-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-primary"
                        >
                            {feature.icon}
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-3">{feature.title}</h3>
                    <p className="text-gray-500 leading-relaxed font-medium">{feature.desc}</p>
                </motion.div>
            ))}
        </section>
    );
}
