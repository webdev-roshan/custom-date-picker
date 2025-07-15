"use client";

import { Calendar1 } from "lucide-react";
import { useState } from "react";
import CustomDatePickerModel from "./components/CustomDatePickerModel";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState("Select date");
  const [datePickerModel, setDatePickerModel] = useState(false);
  const [activeTab, setActiveTab] = useState("tillDate");

  const handleDateSelection = (date: string, tab: string) => {
    setSelectedDate(date);
    setDatePickerModel(false);
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (tab !== "tillDate") {
      const date = getDateForTab(tab);
      handleDateSelection(date, tab);
    }
  };

  const getDateForTab = (tab: string) => {
    const today = new Date();
    switch (tab) {
      case "today":
        return today.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      case "thisMonth":
        return `${today.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
      case "lastMonth": {
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1);
        return `${lastMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
      }
      case "thisYear":
        return `${today.getFullYear()}`;
      default:
        return "Select date";
    }
  };

  return (
    <div className="relative mx-8 mt-8">
      <button
        className="border cursor-pointer border-solid border-gray-300 text-gray-700 px-4 py-2.5 rounded-md flex items-center gap-2 hover:border-gray-400 min-w-[200px]"
        onClick={() => setDatePickerModel(!datePickerModel)}
      >
        <Calendar1 className="w-5 h-5 text-gray-500" />
        <span className="text-sm">{selectedDate}</span>
      </button>

      {datePickerModel && (
        <div className="absolute z-10 p-4 rounded-lg shadow-lg left-0 mt-2 bg-white border border-gray-200 min-w-[600px]">
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-1 border-r border-gray-200 pr-4">
              <div className="flex flex-col gap-1">
                {[
                  { id: "today", label: "Today" },
                  { id: "thisMonth", label: "This Month" },
                  { id: "lastMonth", label: "Last Month" },
                  { id: "thisYear", label: "This Year" },
                  { id: "tillDate", label: "Till Date" }
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => handleTabClick(id)}
                    className={`py-2 px-3 text-left rounded-md transition-colors duration-200 text-sm
                      ${activeTab === id
                        ? "bg-blue-600 text-white font-medium"
                        : "text-gray-700 hover:bg-gray-100"}
                    `}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="col-span-2 pl-2">
              {activeTab === "tillDate" ? (
                <CustomDatePickerModel onDateSelect={handleDateSelection} />
              ) : (
                <div className="p-4">
                  <h2 className="text-gray-700 font-medium text-sm mb-2">Selected Period</h2>
                  <p className="text-sm text-gray-600">{getDateForTab(activeTab)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
