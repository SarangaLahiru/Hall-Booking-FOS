import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useState } from 'react';
import FadeIn from 'react-fade-in';
import Swal from 'sweetalert2';
import { firestore } from '../../firebase';
import Calendar3 from './calender3';

export default function Home() {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedDuration, setSelectedDuration] = useState('');
    const [showCalendar, setShowCalendar] = useState(false);

    const handleCheckAvailability = async () => {
        if (!selectedDate || !selectedTime || !selectedDuration) {
            Swal.fire({
                title: "Oops...",
                text: "Please select date, time, and duration to check availability.",
                icon: "error"
            });
            setShowCalendar(false)
        } else {
            try {
                const bookingsRef = collection(firestore, 'bookings');
                const q = query(bookingsRef,
                    where('date', '==', selectedDate)
                );
                const querySnapshot = await getDocs(q);

                const selectedDateTime = new Date(selectedDate + 'T' + selectedTime);
                const selectedEndTime = new Date(selectedDateTime.getTime() + selectedDuration * 60 * 60 * 1000);

                let isAvailable = true;

                querySnapshot.forEach((doc) => {
                    const bookingData = doc.data();
                    const bookingStartTime = new Date(bookingData.date + 'T' + bookingData.time);
                    const bookingEndTime = new Date(bookingStartTime.getTime() + bookingData.duration * 60 * 60 * 1000);

                    if (
                        (selectedDateTime >= bookingStartTime && selectedDateTime < bookingEndTime) ||
                        (selectedEndTime > bookingStartTime && selectedEndTime <= bookingEndTime) ||
                        (selectedDateTime <= bookingStartTime && selectedEndTime >= bookingEndTime)
                    ) {
                        // Time slot overlaps with existing booking
                        isAvailable = false;
                        return;
                    }
                });

                if (isAvailable) {
                    console.log('Date and time slot is available.');
                    Swal.fire({
                        title: "Available",
                        text: "Date and time slot is available",
                        icon: "success",
                        showCancelButton: true, // Show close button
                        confirmButtonText: "Go to Booking", // Change button text to "Booking"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // Construct the URL with query parameters
                            const bookingUrl = `/booking?date=${selectedDate}&time=${selectedTime}&duration=${selectedDuration}`;
                            // Navigate to booking page with query parameters
                            window.location.href = bookingUrl;
                        }
                    });
                    setShowCalendar(false)
                } else {
                    console.log('Date and time slot is not available.');
                    Swal.fire({
                        title: "Unavailable",
                        text: "Date and time slot is not available",
                        icon: "error"
                    });
                }
            } catch (error) {
                console.error('Error checking availability:', error);
            }
        }
    };

    return (
        <>
            <div className=''>
                <FadeIn>
                    <div className="dis absolute text-cyan-50 m-20 mt-52 max-sm:mt-20 max-sm:m-8 max-md:mt-20 max-md:m-8">
                        <h2 className="lg:text-9xl font-sans font-bold sm:text-2xl max-md:text-4xl xl:text-9xl">Hall Booking</h2>
                        <h1 className='text-4xl max-lg:m-5  max-sm:text-xl max-lg:m-1 max-md:text-xl'>Explore your place here</h1>
                    </div>
                </FadeIn>
                <img className='m-auto rounded-b-3xl' width="100%" src="https://img.freepik.com/free-photo/3d-cinema-theatre-seating_23-2151005461.jpg?t=st=1718390980~exp=1718394580~hmac=e7a5f5376dd8574de322762f1c08a39667156f85c1339a33cfba65f87b51cf9e&w=1380" alt="" />
            </div>

            <div className='relative max-sm:top-0 -top-72 '>
                <FadeIn>
                    <div className='w-3/4 max-lg:bg-white h-24 m-auto rounded-xl flex items-center justify-center flex-wrap'>
                        <div className='w-full max-sm:bg-white bg-neutral-100 h-24 m-auto rounded-3xl flex items-center justify-center flex-wrap'>
                            <div className="m-4" >
                                <label htmlFor="date" className="block text-gray-700 font-semibold">Date:</label>
                                <input
                                    id="date"
                                    type="date"
                                    value={selectedDate}
                                    onClick={(e) => {
                                        { setShowCalendar(true) };
                                    }}
                                    onChange={(e) => {
                                        setSelectedDate(e.target.value);


                                    }}
                                    className="max-sm:w-72 mt-1 block w-full shadow-xl h-12 rounded-md border-gray-300 shadow-sm p-4 w-96 text-xl focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                />
                            </div>
                            <div className="m-4">
                                <label htmlFor="time" className="block text-gray-700 font-semibold">Time:</label>
                                <input
                                    id="time"
                                    type="time"
                                    value={selectedTime}
                                    onChange={(e) => setSelectedTime(e.target.value)}
                                    className=" max-sm:w-72 mt-1 block w-full shadow-xl h-12 rounded-md p-4 w-96 text-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                />
                            </div>
                            <div className="m-4">
                                <label htmlFor="duration" className="block text-gray-700 font-semibold">Duration (hours):</label>
                                <input
                                    id="duration"
                                    type="number"
                                    value={selectedDuration}
                                    onChange={(e) => setSelectedDuration(e.target.value)}
                                    className="max-sm:w-72 mt-1 block w-full shadow-xl h-12 rounded-md p-4 w-96 text-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                />
                            </div>
                            <button
                                onClick={handleCheckAvailability}
                                className="m-4 px-16  py-4 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-500 focus:ring-opacity-50"
                            >
                                Check Availability
                            </button>
                        </div>
                    </div>
                </FadeIn>
                {showCalendar && (
                    <FadeIn>
                        <div className='max-sm:mt-80 w-96 m-auto mt-5  bg-white rounded-lg'>
                            <Calendar3 />
                        </div>
                    </FadeIn>
                )}
            </div>
        </>
    );
}
