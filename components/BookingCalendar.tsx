
import React, { useState } from 'react';

interface BookingCalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
  bookedDates?: Date[];
  className?: string;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({ 
  selectedDate, 
  onDateSelect,
  selectedTime,
  onTimeSelect,
  bookedDates = [],
  className = "bg-white p-6 rounded-3xl border border-gray-100 shadow-xl"
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  const timeSlots = [
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"
  ];

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    const today = new Date();
    const prev = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    if (prev < new Date(today.getFullYear(), today.getMonth(), 1)) return;
    setCurrentMonth(prev);
  };
  
  const handleDateClick = (day: number) => {
      const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      if (newDate < new Date(new Date().setHours(0,0,0,0))) return;
      onDateSelect(newDate);
  }

  const renderCalendarDays = () => {
      const days = [];
      for (let i = 0; i < firstDayOfMonth; i++) {
          days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
      }
      for (let d = 1; d <= daysInMonth; d++) {
          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d);
          const isSelected = selectedDate?.toDateString() === date.toDateString();
          const isToday = new Date().toDateString() === date.toDateString();
          const isPast = date < new Date(new Date().setHours(0,0,0,0));
          const isBooked = bookedDates.some(bd => bd.toDateString() === date.toDateString());

          days.push(
              <button
                  key={d}
                  disabled={isPast || isBooked}
                  onClick={() => handleDateClick(d)}
                  className={`h-10 w-10 rounded-full flex items-center justify-center text-sm transition-all relative
                      ${isSelected ? 'bg-brand-gold text-white shadow-lg scale-110 font-bold z-10' : ''}
                      ${!isSelected && !isPast && !isBooked ? 'hover:bg-gray-100 text-gray-700' : ''}
                      ${isToday && !isSelected ? 'font-bold border-2 border-brand-gold text-brand-gold' : ''}
                      ${isPast ? 'text-gray-300 cursor-not-allowed' : ''}
                      ${isBooked ? 'bg-gray-100 text-gray-300 cursor-not-allowed line-through' : ''}
                  `}
                  title={isBooked ? "Fully Booked" : ""}
              >
                  {d}
              </button>
          );
      }
      return days;
  };

  return (
    <div className={className}>
        <div className="flex justify-between items-center mb-6">
            <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <span className="font-bold text-gray-900 text-lg">{months[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
        </div>

        <div className="mb-8">
            <div className="grid grid-cols-7 mb-2">
                {daysOfWeek.map(d => <div key={d} className="h-10 w-10 flex items-center justify-center text-xs font-bold text-gray-400 uppercase">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-y-1 justify-items-center">
                {renderCalendarDays()}
            </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-4">Select a Time</h4>
            <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
                {timeSlots.map(time => (
                    <button
                        key={time}
                        onClick={() => onTimeSelect(time)}
                        className={`py-3 px-1 rounded-xl text-sm font-medium transition-colors border
                            ${selectedTime === time 
                                ? 'bg-brand-dark text-white border-brand-dark shadow-md' 
                                : 'bg-white text-gray-600 border-gray-200 hover:border-brand-gold hover:text-brand-dark'}
                        `}
                    >
                        {time}
                    </button>
                ))}
            </div>
        </div>
    </div>
  );
};

export default BookingCalendar;
