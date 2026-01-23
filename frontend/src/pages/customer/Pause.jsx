import React, { useState } from 'react';
import Button from '../../components/ui/Button';

const Pause = () => {
    // Mock days for calendar
    const days = Array.from({ length: 30 }, (_, i) => i + 1);
    const [selectedDays, setSelectedDays] = useState([24, 25]); // Mock already selected days

    const toggleDay = (day) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter(d => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };

    return (
        <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
            <h2 className="text-2xl font-bold text-gray-900">Pause Updates ⏸️</h2>

            <div className="glass-panel p-6 rounded-3xl">
                <p className="text-sm text-gray-500 mb-6">Select dates to pause your tiffin service. <br /><span className="text-xs text-red-500">*Money will be refunded to wallet.</span></p>

                {/* Simple Grid Calendar Mock */}
                <div className="grid grid-cols-7 gap-2 mb-8">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                        <div key={d} className="text-center text-xs font-bold text-gray-400 py-2">{d}</div>
                    ))}
                    {days.map(day => (
                        <button
                            key={day}
                            onClick={() => toggleDay(day)}
                            className={`
                                h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center text-sm font-bold transition-all
                                ${selectedDays.includes(day)
                                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                                    : 'bg-white/50 text-gray-700 hover:bg-white'
                                }
                            `}
                        >
                            {day}
                        </button>
                    ))}
                </div>

                <div className="bg-gray-50 p-4 rounded-xl mb-6">
                    <p className="text-sm font-bold text-gray-800 mb-1">Paused Dates:</p>
                    <p className="text-sm text-gray-600">{selectedDays.length > 0 ? selectedDays.map(d => `${d} Jan`).join(', ') : 'None'}</p>
                </div>

                <Button className="w-full">Save Changes</Button>
            </div>
        </div>
    );
};

export default Pause;
