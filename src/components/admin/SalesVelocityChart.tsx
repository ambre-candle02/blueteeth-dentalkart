"use client";

import { useMemo } from "react";

interface Order {
    createdAt: string;
    totalAmount: number;
}

export default function SalesVelocityChart({ orders }: { orders: Order[] }) {
    const data = useMemo(() => {
        const last12Days = Array.from({ length: 12 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (11 - i));
            return d.toISOString().split('T')[0];
        });

        const dailyRevenue = last12Days.map(date => {
            const revenue = orders
                .filter(o => o.createdAt.startsWith(date))
                .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
            return revenue;
        });

        const maxRevenue = Math.max(...dailyRevenue, 1);
        return dailyRevenue.map((rev, i) => ({
            height: (rev / maxRevenue) * 100,
            revenue: rev,
            day: last12Days[i].split('-')[2]
        }));
    }, [orders]);

    return (
        <div className="h-full w-full flex items-end justify-between gap-1 border-b border-slate-100 pb-2">
            {data.map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                    <div
                        style={{ height: `${Math.max(item.height, 2)}%` }}
                        className="w-full bg-slate-200 hover:bg-slate-300 transition-colors"
                        title={`₹${item.revenue}`}
                    />
                    <span className="text-[9px] text-slate-400 mt-1">{item.day}</span>
                </div>
            ))}
        </div>
    );
}
