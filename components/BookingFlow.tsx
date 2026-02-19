
import React, { useState } from 'react';
import { Chef, Menu, User, Booking } from '../types';
import PaymentGateway from './PaymentGateway';
import BookingCalendar from './BookingCalendar';

interface BookingFlowProps {
    chef: Chef;
    menu: Menu;
    user: User | null;
    onCancel: () => void;
    onBookingSuccess: (booking: Booking) => void;
}

type BookingStep = 'DETAILS' | 'PAYMENT' | 'CONFIRMATION';

const BookingFlow: React.FC<BookingFlowProps> = ({ chef, menu, user, onCancel, onBookingSuccess }) => {
    const [step, setStep] = useState<BookingStep>('DETAILS');
    const [bookingDate, setBookingDate] = useState<Date>(new Date());
    const [bookingTime, setBookingTime] = useState<string>('19:00');
    const [guests, setGuests] = useState(6);
    const [notes, setNotes] = useState('');

    const totalPrice = menu.pricePerHead * guests;

    const handleConfirmDetails = (e: React.FormEvent) => {
        e.preventDefault();
        setStep('PAYMENT');
    };

    const handlePaymentSuccess = () => {
        const newBooking: Booking = {
            id: `bk_${Date.now()}`,
            userId: user!.id,
            chefId: chef.id,
            chefName: chef.name,
            chefImage: chef.imageUrl,
            menuName: menu.name,
            date: bookingDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
            time: bookingTime,
            guests: guests,
            totalPrice: totalPrice,
            status: 'CONFIRMED',
            createdAt: new Date().toISOString()
        };
        onBookingSuccess(newBooking);
    };

    const renderDetailsStep = () => (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Left Side: Calendar and Details */}
                <div className="space-y-8">
                    <h2 className="text-3xl font-serif font-bold text-gray-900">Confirm Your Event Details</h2>
                    <BookingCalendar
                        selectedDate={bookingDate}
                        onDateSelect={setBookingDate}
                        selectedTime={bookingTime}
                        onTimeSelect={setBookingTime}
                        bookedDates={[]}
                    />
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Special Requests or Dietary Notes</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl p-4 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                            placeholder={`e.g., "One guest is vegetarian", "Celebrating a 50th birthday"`}
                        />
                    </div>
                </div>

                {/* Right Side: Sticky Summary */}
                <div className="sticky top-28">
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-2xl space-y-6">
                        <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                            <img src={chef.imageUrl} alt={chef.name} className="w-16 h-16 rounded-2xl object-cover" />
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase">Your Chef</p>
                                <h3 className="text-xl font-serif font-bold text-gray-900">{chef.name}</h3>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase">Selected Menu</p>
                            <h4 className="font-bold text-gray-800">{menu.name}</h4>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Guests</label>
                                <select 
                                    value={guests} 
                                    onChange={(e) => setGuests(parseInt(e.target.value))}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                                >
                                    {[...Array(15)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
                                </select>
                            </div>
                             <div>
                                <p className="text-xs text-gray-400 font-bold uppercase mb-2">Price per Guest</p>
                                <p className="font-bold text-lg p-3">£{menu.pricePerHead}</p>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-6 flex justify-between items-center">
                            <p className="text-xs text-gray-400 font-bold uppercase">Total (inc. VAT)</p>
                            <p className="text-3xl font-serif font-bold text-brand-dark">£{totalPrice.toFixed(2)}</p>
                        </div>

                        <button onClick={handleConfirmDetails} className="w-full bg-brand-dark text-white font-bold py-4 rounded-2xl hover:bg-black transition-all shadow-xl">
                            Proceed to Payment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
    
    if (!user) return <p>Please log in to continue.</p>;

    return (
        <div className="min-h-screen bg-brand-light pt-28">
            <button onClick={onCancel} className="absolute top-8 left-8 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-dark">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                Back to Chef
            </button>
           
            {step === 'DETAILS' && renderDetailsStep()}
            
            {step === 'PAYMENT' && (
                <PaymentGateway
                    amount={totalPrice}
                    chefName={chef.name}
                    menuName={menu.name}
                    onSuccess={handlePaymentSuccess}
                    onCancel={() => setStep('DETAILS')}
                />
            )}
        </div>
    );
};

export default BookingFlow;
