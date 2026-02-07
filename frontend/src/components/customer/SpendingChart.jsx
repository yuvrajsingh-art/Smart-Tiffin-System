import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

const SpendingChart = ({ data }) => {
    if (!data || data.length === 0) return null;

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#2D241E] p-3 rounded-xl shadow-2xl border border-white/10 animate-[scaleIn_0.1s_ease-out]">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{payload[0].payload.date}</p>
                    <p className="text-lg font-black text-white">₹{payload[0].value.toFixed(2)}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-[160px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 9, fontWeight: 800, fill: '#9CA3AF' }}
                        dy={8}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 9, fontWeight: 800, fill: '#9CA3AF' }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F9FAFB', radius: 6 }} />
                    <Bar
                        dataKey="amount"
                        radius={[4, 4, 4, 4]}
                        barSize={20}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.amount > 0 ? '#FF6B00' : '#E5E7EB'}
                                className="transition-all duration-300"
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SpendingChart;
