"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

interface CustomDatePickerModelProps {
    onDateSelect: (date: string, tab: string) => void;
}

function CustomDatePickerModel({ onDateSelect }: CustomDatePickerModelProps) {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [startMonth, setStartMonth] = useState(new Date());
    const [endMonth, setEndMonth] = useState(new Date(new Date().setMonth(new Date().getMonth() + 1)));
    const [showStartMonthDropdown, setShowStartMonthDropdown] = useState(false);
    const [showEndMonthDropdown, setShowEndMonthDropdown] = useState(false);

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const getMonthDays = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days = [];

        for (let i = 0; i < firstDay.getDay(); i++) {
            days.push(null);
        }

        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    };

    const formatDate = (date: Date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    const formatDisplayDate = (date: Date | null) => {
        if (!date) return "";
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const isFutureDate = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date > today;
    };

    const handleDateClick = (date: Date, isStartCalendar: boolean) => {
        if (isFutureDate(date)) {
            return;
        }

        if (isStartCalendar) {
            setStartDate(date);
            if (endDate && date > endDate) {
                setEndDate(null);
            }
        } else {
            if (!startDate) {
                setStartDate(date);
                setEndDate(date);
            } else if (date < startDate) {
                setEndDate(startDate);
                setStartDate(date);
            } else {
                setEndDate(date);
            }
        }
    };

    const isDateInRange = (date: Date) => {
        if (!startDate || !endDate) return false;
        return date >= startDate && date <= endDate;
    };

    const isDateSelected = (date: Date) => {
        return (startDate && formatDate(date) === formatDate(startDate)) ||
            (endDate && formatDate(date) === formatDate(endDate));
    };

    const handleApply = () => {
        if (startDate && endDate) {
            const formattedStart = formatDisplayDate(startDate);
            const formattedEnd = formatDisplayDate(endDate);
            onDateSelect(`${formattedStart} - ${formattedEnd}`, "tillDate");
        }
    };

    const handleMonthNavigation = (calendar: 'start' | 'end', direction: 'prev' | 'next') => {
        const setter = calendar === 'start' ? setStartMonth : setEndMonth;
        const current = calendar === 'start' ? startMonth : endMonth;
        const newDate = new Date(current);
        newDate.setMonth(current.getMonth() + (direction === 'next' ? 1 : -1));
        setter(newDate);
    };

    const handleMonthSelect = (calendar: 'start' | 'end', monthIndex: number) => {
        const setter = calendar === 'start' ? setStartMonth : setEndMonth;
        const current = calendar === 'start' ? startMonth : endMonth;
        const newDate = new Date(current);
        newDate.setMonth(monthIndex);
        setter(newDate);
        if (calendar === 'start') {
            setShowStartMonthDropdown(false);
        } else {
            setShowEndMonthDropdown(false);
        }
    };

    const renderMonthDropdown = (currentMonth: Date, isStartCalendar: boolean) => {
        const showDropdown = isStartCalendar ? showStartMonthDropdown : showEndMonthDropdown;
        const setShowDropdown = isStartCalendar ? setShowStartMonthDropdown : setShowEndMonthDropdown;

        return (
            <div className="relative">
                <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 py-1 focus:outline-none group"
                >
                    <span className="text-sm font-medium text-gray-900">
                        {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-300 group-hover:bg-gray-400 transition-colors" />

                {showDropdown && (
                    <div className="absolute z-20 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                        <div className="py-1 max-h-48 overflow-y-auto">
                            {Array.from({ length: 12 }, (_, monthIndex) => {
                                const date = new Date(currentMonth);
                                date.setMonth(monthIndex);
                                return (
                                    <button
                                        key={monthIndex}
                                        onClick={() => handleMonthSelect(isStartCalendar ? 'start' : 'end', monthIndex)}
                                        className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                                    >
                                        {monthNames[monthIndex]} {date.getFullYear()}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderCalendar = (currentMonth: Date, isStartCalendar: boolean) => (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                {renderMonthDropdown(currentMonth, isStartCalendar)}
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => handleMonthNavigation(isStartCalendar ? 'start' : 'end', 'prev')}
                        className="p-1 hover:bg-gray-100 rounded-full"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                        onClick={() => handleMonthNavigation(isStartCalendar ? 'start' : 'end', 'next')}
                        className="p-1 hover:bg-gray-100 rounded-full"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1">
                {daysOfWeek.map(day => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                        {day}
                    </div>
                ))}
                {getMonthDays(currentMonth).map((date, index) => (
                    <div key={index} className="text-center py-1">
                        {date && (
                            <button
                                onClick={() => handleDateClick(date, isStartCalendar)}
                                disabled={isFutureDate(date)}
                                className={`w-8 h-8 rounded-full text-sm relative
                                    ${isDateSelected(date)
                                        ? 'bg-blue-600 text-white'
                                        : isDateInRange(date)
                                            ? 'bg-blue-100 text-blue-600'
                                            : isToday(date)
                                                ? 'border-2 border-blue-600 text-gray-900'
                                                : isFutureDate(date)
                                                    ? 'text-gray-300 cursor-not-allowed'
                                                    : 'hover:bg-gray-100 text-gray-700'
                                    }
                                    ${isToday(date) && isDateSelected(date) ? 'border-0' : ''}
                                `}
                            >
                                {date.getDate()}
                                {isToday(date) && !isDateSelected(date) && (
                                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
                                )}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="p-4">
            <div className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-8">
                    {renderCalendar(startMonth, true)}
                    {renderCalendar(endMonth, false)}
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex gap-8">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Start Date</label>
                            <div className="text-sm text-gray-900">{formatDisplayDate(startDate) || "Not selected"}</div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">End Date</label>
                            <div className="text-sm text-gray-900">{formatDisplayDate(endDate) || "Not selected"}</div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => {
                                setStartDate(null);
                                setEndDate(null);
                            }}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                            Clear
                        </button>
                        <button
                            onClick={handleApply}
                            disabled={!startDate || !endDate}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Apply
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CustomDatePickerModel;