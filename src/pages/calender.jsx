import React, { useState, useEffect } from 'react';
import { Grid, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { firestore } from '../../firebase';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { Badge } from 'rsuite';

function Calendar() {
    const [bookedDates, setBookedDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [bookingDetails, setBookingDetails] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        fetchBookedDates();
    }, []);

    const fetchBookedDates = async () => {
        try {
            const snapshot = await getDocs(collection(firestore, 'bookings'));
            const dates = snapshot.docs.map(doc => doc.data());
            setBookedDates(dates);

        } catch (error) {
            console.error('Error fetching booked dates:', error);
        }
    };

    const handleDateClick = (value) => {
        setSelectedDate(value.date);
        const selectedDateFormatted = value.date.toISOString().split('T')[0]; // Convert clicked date to "YYYY-MM-DD" format

        const selectedBooking = bookedDates.filter((booking) => booking.date === selectedDateFormatted);
        console.log(selectedBooking)
        if (selectedBooking.length > 0) {
            setBookingDetails(selectedBooking);
            setDialogOpen(true);
        } else {
            // If no booking found, reset the booking details
            setBookingDetails(null);
            console.log("No booking found for selected date:", selectedDateFormatted);
        }
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    return (
        <Grid container justifyContent="center" spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h6">Booked Dates:</Typography>
                <div style={{ overflowX: 'auto' }}>
                    <CalendarHeatmap
                        startDate={new Date('2024-01-01')}
                        endDate={new Date('2024-12-31')}
                        values={bookedDates.map(date => ({
                            date: new Date(date.date), // Convert date string to Date object
                            count: 1 // Assuming each booking counts as 1
                        }))}
                        onClick={handleDateClick}
                    />
                </div>
            </Grid>
            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>Booking Details</DialogTitle>
                <DialogContent>
                    {bookingDetails && (
                        <div>
                            <h2>{bookingDetails[0].date}</h2>
                            {bookingDetails.map((booking, index) => (
                                <Typography key={index}>
                                    <Badge /> Time: {booking.time}
                                </Typography>
                            ))}
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Close</Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
}

export default Calendar;
