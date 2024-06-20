import React, { useState, useEffect } from 'react';
import { Calendar, Badge, Whisper, Popover } from 'rsuite';
import "rsuite/dist/rsuite.min.css";
import "rsuite/dist/rsuite-rtl.min.css";
import { firestore } from '../../firebase'; // Import Firebase Firestore
import { collection, getDocs } from 'firebase/firestore'; // Import Firestore functions
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const BookingCalendar = () => {
    const [bookedDates, setBookedDates] = useState([]);
    const [selectedDateBookings, setSelectedDateBookings] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        fetchBookedDates();
    }, []);

    const fetchBookedDates = async () => {
        try {
            const querySnapshot = await getDocs(collection(firestore, 'bookings'));
            const bookings = [];
            querySnapshot.forEach((doc) => {
                const bookingData = doc.data();
                bookings.push({ date: bookingData.date, time: bookingData.time, reason: bookingData.reason });
            });
            console.log(bookings)
            setBookedDates(bookings);
        } catch (error) {
            console.error('Error fetching booked dates:', error);
        }
    };

    const handleDateSelect = (date) => {
        const formattedDate = date.toISOString().split('T')[0]; // Convert date to "YYYY-MM-DD" format
        const selectedDateBookings = bookedDates.filter((booking) => booking.date === formattedDate);
        setSelectedDateBookings(selectedDateBookings);
        console.log(selectedDateBookings.length)
        if (selectedDateBookings.length > 0) {
            setOpenDialog(true)
        }
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    const renderCell = (date) => {
        const formattedDate = date.toISOString().split('T')[0]; // Convert date to "YYYY-MM-DD" format
        const filteredBookings = bookedDates.filter((booking) => booking.date === formattedDate);

        if (filteredBookings.length) {
            const displayList = filteredBookings.slice(0, 2);
            const moreCount = filteredBookings.length - displayList.length;
            const moreItem = (
                <Popover title="More Items">
                    <ul>
                        {filteredBookings.map((item, index) => (
                            <li key={index}>
                                <b>{item.time}</b> - {item.reason}
                            </li>
                        ))}
                    </ul>
                </Popover>
            );



            return (
                <div className="calendar-todo-container">
                    {displayList.map((item, index) => (
                        <div key={index} className="calendar-todo-item">
                            <Badge /> <b>{item.time}</b> - {item.reason}
                        </div>
                    ))}
                    {moreCount ? (
                        <Whisper placement="top" trigger="click" speaker={moreItem}>
                            <a>{moreCount} more</a>
                        </Whisper>
                    ) : null}
                </div>
            );
        }

        return null;
    };

    return (
        <>
            <Calendar bordered renderCell={renderCell} onSelect={handleDateSelect} />
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Booked Times and Reasons for Selected Date</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {selectedDateBookings.map((booking, index) => (
                            <div key={index}>
                                <Badge />  <b>{booking.time}</b> - {booking.reason}
                            </div>
                        ))}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default BookingCalendar;
