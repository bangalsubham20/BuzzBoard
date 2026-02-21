"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { TrendingUpIcon, UsersIcon, CheckCircleIcon, ClockIcon } from "lucide-react";

interface AnalyticsDashboardProps {
    data: any;
}

export function AnalyticsDashboard({ data }: AnalyticsDashboardProps) {
    const {
        registrationTrends,
        growthTrends,
        hourlyAttendance,
        eventStats,
        totalStudents,
        totalRegistrations,
        totalAttendance,
    } = data;

    return (
        <div className="space-y-8 pb-20">
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Community", value: totalStudents, icon: UsersIcon, color: "primary", desc: "Total students joined" },
                    { label: "Bookings", value: totalRegistrations, icon: TrendingUpIcon, color: "secondary", desc: "All-time registrations" },
                    { label: "Validated", value: totalAttendance, icon: CheckCircleIcon, color: "primary", desc: "Total attendance marked" }
                ].map((stat, i) => (
                    <Card key={i} className="glass border-white/20 rounded-3xl overflow-hidden shadow-xl shadow-primary/5 group">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-primary/60">{stat.label}</CardTitle>
                            <div className={`h-10 w-10 rounded-xl bg-${stat.color}/10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <stat.icon className={`h-5 w-5 text-${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-black text-primary">{stat.value}</div>
                            <p className="text-xs text-gray-500 mt-2 font-bold">{stat.desc}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Registration Activity */}
                <Card className="glass border-white/20 rounded-3xl overflow-hidden shadow-2xl shadow-primary/5">
                    <CardHeader className="bg-primary/5 border-b border-primary/10 p-6">
                        <CardTitle className="text-xl font-bold text-primary flex items-center">
                            <TrendingUpIcon className="h-5 w-5 mr-3 text-secondary" />
                            Registration Velocity
                        </CardTitle>
                        <CardDescription className="text-primary/40 font-bold uppercase text-[10px] tracking-widest mt-1">Last 30 days performance</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={registrationTrends}>
                                <defs>
                                    <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#339CD5" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#339CD5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DCDEEA" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#273574', fontSize: 10, fontWeight: 700 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#273574', fontSize: 10, fontWeight: 700 }}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'white', borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(39, 53, 116, 0.1)' }}
                                    itemStyle={{ color: '#273574', fontWeight: 700 }}
                                />
                                <Area type="monotone" dataKey="count" stroke="#339CD5" strokeWidth={3} fillOpacity={1} fill="url(#colorReg)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Hourly Attendance */}
                <Card className="glass border-white/20 rounded-3xl overflow-hidden shadow-2xl shadow-primary/5">
                    <CardHeader className="bg-primary/5 border-b border-primary/10 p-6">
                        <CardTitle className="text-xl font-bold text-primary flex items-center">
                            <ClockIcon className="h-5 w-5 mr-3 text-secondary" />
                            Peak Check-in Hours
                        </CardTitle>
                        <CardDescription className="text-primary/40 font-bold uppercase text-[10px] tracking-widest mt-1">Global attendance distribution</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={hourlyAttendance}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DCDEEA" />
                                <XAxis
                                    dataKey="hour"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#273574', fontSize: 10, fontWeight: 700 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#273574', fontSize: 10, fontWeight: 700 }}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'white', borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(39, 53, 116, 0.1)' }}
                                    itemStyle={{ color: '#273574', fontWeight: 700 }}
                                />
                                <Bar dataKey="count" fill="#273574" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Event Leaderboard */}
                <Card className="glass border-white/20 rounded-3xl overflow-hidden shadow-2xl shadow-primary/5 lg:col-span-2">
                    <CardHeader className="bg-primary/5 border-b border-primary/10 p-6">
                        <CardTitle className="text-xl font-bold text-primary flex items-center">
                            <TrendingUpIcon className="h-5 w-5 mr-3 text-secondary" />
                            Event Conversion Matrix
                        </CardTitle>
                        <CardDescription className="text-primary/40 font-bold uppercase text-[10px] tracking-widest mt-1">Registrations vs Actual Attendance</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={eventStats} layout="vertical" margin={{ left: 50 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#DCDEEA" />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="title"
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    width={150}
                                    tick={{ fill: '#273574', fontSize: 11, fontWeight: 800 }}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'white', borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(39, 53, 116, 0.1)' }}
                                    itemStyle={{ fontWeight: 700 }}
                                />
                                <Bar dataKey="registrations" name="Registrations" fill="#339CD5" radius={[0, 6, 6, 0]} barSize={20} />
                                <Bar dataKey="attendance" name="Attendance" fill="#273574" radius={[0, 6, 6, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
