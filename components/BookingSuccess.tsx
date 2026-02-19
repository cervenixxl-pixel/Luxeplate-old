
import React from 'react';
import { Booking } from '../types';

interface BookingSuccessProps {
    booking: Booking;
    onDone: () => void;
}

const BookingSuccess: React.FC<BookingSuccessProps> = ({ booking, onDone }) => {
  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center p-4 animate-in fade-in duration-500">
        <div className="w-full max-w-lg">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center border border-gray-100">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 animate-in zoom-in duration-300">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>

                <h2 className="text-3xl font-serif font-bold text-gray-900">Booking Confirmed!</h2>
                <p className="text-gray-500 mt-2">Your private chef experience is locked in.</p>

                <div className="text-left bg-gray-50 border border-gray-100 rounded-2xl p-6 my-8 space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-400 uppercase">Chef</span>
                        <span className="font-bold text-gray-800">{booking.chefName}</span>
                    </div>
                     <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-400 uppercase">Menu</span>
                        <span className="font-bold text-gray-800">{booking.menuName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-400 uppercase">Date & Time</span>
                        <span className="font-bold text-gray-800">{booking.date} at {booking.time}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-400 uppercase">Guests</span>
                        <span className="font-bold text-gray-800">{booking.guests}</span>
                    </div>
                    <div className="border-t border-gray-200 my-2"></div>
                     <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-400 uppercase">Total Paid</span>
                        <span className="font-bold text-xl text-brand-dark">£{booking.totalPrice.toFixed(2)}</span>
                    </div>
                </div>

                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                    A confirmation email has been sent to your address. Chef {booking.chefName.split(' ')[0]} will be in touch soon to finalize details.
                </p>

                <button 
                    onClick={onDone}
                    className="mt-8 w-full bg-brand-dark text-white font-bold py-4 rounded-2xl hover:bg-black transition-all shadow-xl"
                >
                    Explore More Chefs
                </button>
            </div>
        </div>
    </div>
  );
};

export default BookingSuccess;
