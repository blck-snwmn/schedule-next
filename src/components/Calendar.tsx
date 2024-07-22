"use client";

import type React from 'react';
import { useState } from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameMonth, isToday } from 'date-fns';
import { ja } from 'date-fns/locale';

interface CalendarProps {
    events: ScheduleEvent[];
}

const Calendar: React.FC<CalendarProps> = ({ events }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const hasEvent = (date: Date) => {
        return events.some(event =>
            event.schedules.some(schedule =>
                new Date(schedule.start_at) <= date && new Date(schedule.end_at) >= date
            )
        );
    };

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden text-black mb-5">
            <div className="flex items-center justify-between px-6 py-4 border-b">
                <h2 className="text-xl font-semibold text-gray-800">
                    {format(currentDate, 'yyyy年 M月', { locale: ja })}
                </h2>
                <div>
                    <button type='button' onClick={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}>
                        前月
                    </button>
                    <button type='button' onClick={() => setCurrentDate(new Date())} className="mx-2">
                        今日
                    </button>
                    <button type='button' onClick={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}>
                        翌月
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-px bg-gray-200">
                {['日', '月', '火', '水', '木', '金', '土'].map(day => (
                    <div key={day} className="text-center py-2 bg-gray-100">
                        {day}
                    </div>
                ))}
                {daysInMonth.map(day => (
                    <div
                        key={day.toString()}
                        className={`p-2 bg-white ${!isSameMonth(day, currentDate) ? 'text-gray-400' :
                            isToday(day) ? 'bg-blue-100' : ''
                            }`}
                    >
                        <span className="text-sm">{format(day, 'd')}</span>
                        <div className="w-2 h-2 mt-1">
                            {hasEvent(day) && (
                                <div className="w-full h-full bg-blue-500 rounded-full" />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Calendar;