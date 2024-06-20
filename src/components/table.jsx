import React, { useState, useEffect } from 'react';
// Assuming you have initialized Firebase in a separate file
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, Slide, AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import { collection, doc, getDocs, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { Close, CloseFullscreen, Delete } from '@mui/icons-material';
import { Document, Page } from '@react-pdf/renderer';
import DisplayPDF from './DisplayPDF';
import { height } from '@fortawesome/free-solid-svg-icons/fa0';


export default function CustomTable() {
    const [bookings, setBookings] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [selectData, setSelectData] = useState([]);
    const [ID, setID] = useState('')
    const handleClickOpen = () => {
        setOpen(true);
    };



    const handleClose = () => {
        setOpen(false);
        setID('');
    };
    const fetchData = async () => {
        try {
            const snapshot = await getDocs(collection(firestore, 'bookings'));
            const dates = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id, // Include document ID for key
            }));
            console.log(dates)
            setBookings(dates);
        }
        catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {

        fetchData();
    }, []);
    const handleViewDetails = async (id) => {
        try {
            const docRef = await getDoc(doc(collection(firestore, 'bookings'), id));
            if (docRef.exists) {
                const userData = docRef.data();
                console.log('User Data:', userData);
                setSelectData(userData);
                setID(id);

                // Display user details, for example, in a modal or another component
            } else {
                console.log('No such document!');
            }
        } catch (error) {
            console.error('Error getting user details:', error);
        }
        setOpen(true);

    };
    const handleApprove = async (id) => {
        try {
            await updateDoc(doc(firestore, 'bookings', id), { status: 'approved' });
            // Refresh the list of booking requests after approval
            fetchData();
            window.location.reload();
        } catch (error) {
            // Handle error
            console.error('Error approving booking request:', error);
        }
    };

    const handleReject = async (id) => {
        try {
            await updateDoc(doc(firestore, 'bookings', id), { status: 'rejected' });
            // Refresh the list of booking requests after rejection
            fetchData();
            window.location.reload();
        } catch (error) {
            // Handle error
            console.error('Error rejecting booking request:', error);
        }
    };

    return (
        <>

            <TableContainer component={Paper} sx={{ boxShadow: "0px 0px 50px rgb(178, 178, 178)", width: "1380px", margin: "0px auto", padding: "10px 50px" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell> <span>Name</span></TableCell>
                            <TableCell><span>Request Date</span></TableCell>
                            <TableCell><span>Request Time</span></TableCell>
                            <TableCell><span>Duration </span></TableCell>
                            <TableCell><span>Status</span></TableCell>
                            <TableCell><span></span></TableCell>
                            {/* Add more table headers as needed */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bookings.map((booking, index) => (
                            <TableRow key={booking.id}>
                                <TableCell>{booking.name}</TableCell> {/* Assuming name is a property of your booking object */}
                                <TableCell> <span className=' text-yellow-400 bg-yellow-50 p-2 rounded-2xl'> {booking.date}</span></TableCell> {/* Assuming status is a property of your booking object */}
                                <TableCell> <span className=' text-pink-400 bg-pink-50 p-2 rounded-2xl'>{booking.time}</span> </TableCell>
                                <TableCell> <span className=''>{booking.duration} Hours</span></TableCell>
                                <TableCell><span className={` text-${booking.status === 'pending' ? 'red-500' : 'green-500'}  bg-${booking.status === 'pending' ? 'red-50' : 'green-50'} p-3 rounded-3xl`}>{booking.status}</span></TableCell>
                                <TableCell><Button onClick={() => handleViewDetails(booking.id)}>View</Button></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer >

            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
            >
                <AppBar sx={{ position: 'relative', backgroundColor: "green" }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            {/* <CloseIcon /> */}
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            <h2 className=' text-4xl'>Mr. {selectData.name}</h2>
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleClose}>
                            <Close />
                        </Button>
                    </Toolbar>
                </AppBar>

                <div className="box bg-green-50">


                    <div className="dis m-10">
                        <h2 className='m-10 text-sm relative top-5'>Request details</h2>
                        <h2 className='text-4xl font-bold m-10'>Mr.{selectData.name}</h2>

                        <div>
                            <div style={{ height: "700px" }} className=' bg-white h-3/4  p-10 rounded-2xl shadow-2xl relative'>
                                <div className=' w-full flex flex-wrap  justify-center'>
                                    <div className='h-96'>
                                        <div className=' max-sm:m-auto lg:relative'>
                                            <iframe src={selectData.fileURL} title="PDF Viewer" width="100%" height="450px" className='max-sm:h-96' />


                                        </div>
                                        <button className=' max-sm:top-16 lg:relative top-10 -mt-2 m-10 max-sm:text-sm max-sm:p-1 max-sm:top-3 text-xl border text-green-600 border-green-500 px-5 py-4 active:bg-green-500 hover:bg-green-300 rounded-xl'>View Verify letter</button>

                                    </div>
                                    <div className='flex flex-wrap max-sm:w-full lg:w-3/5 h-40 lg:ml-52 m-2 p-10 relative lg:-left-40'>
                                        <div className="dis">
                                            <h2 className=' lg:text-3xl max-sm:text-sm text-zinc-700 font-bold'>Mr. {selectData.name}</h2>
                                            <h2 className='lg:text-lg relative -top-1 text-zinc-400 max-sm:text-sm max-sm:w-68'>{selectData.position}</h2>
                                            <h2 className='lg:text-lg relative -top-1 text-zinc-400 max-sm:text-sm max-sm:w-68'>{selectData.post}</h2>
                                            <h2 className='lg:text-lg relative -top-1 text-zinc-400 max-sm:text-sm max-sm:w-68'>Bookin ID #{ID}</h2>
                                            <div className='mt-2'>
                                                <h2 className=' lg:text-xl max-sm:text-sm font-bold text-zinc-500'>Request Date</h2>
                                                <h2 className='lg:text-xl relative -top-1 text-zinc-400 max-sm:text-sm max-sm:w-68'>{selectData.date}</h2>
                                            </div>
                                            <div className='mt-2'>
                                                <h2 className=' lg:text-xl max-sm:text-sm text-zinc-500 font-bold'>Request Time</h2>
                                                <h2 className='lg:text-xl relative -top-1 text-zinc-400 max-sm:text-sm max-sm:w-68'>{selectData.time}</h2>
                                            </div>
                                            <div className='mt-2 max-w-80 max-h-96 overflow-auto'>
                                                <h2 className=' lg:text-xl max-sm:text-sm text-zinc-500 font-bold'>Activity</h2>
                                                <h2 className='lg:text-xl relative -top-1 text-zinc-400 max-sm:text-sm max-sm:w-68'>{selectData.reason}sdfsfsdvsf sdf sd sdf dasdasda asdasdad</h2>
                                            </div>

                                        </div>
                                        <div className="dis lg:ml-40">
                                            <div className='mt-2'>
                                                <h2 className=' lg:text-xl max-sm:text-sm font-bold text-zinc-500'>Duration</h2>
                                                <h2 className='lg:text-xl relative -top-1 text-zinc-400 max-sm:text-sm max-sm:w-68'>{selectData.duration} Hours</h2>
                                            </div>
                                            <div className='mt-2'>
                                                <h2 className=' lg:text-xl max-sm:text-sm font-bold text-zinc-500'>Faculty/Society</h2>
                                                <h2 className='lg:text-xl relative -top-1 text-zinc-400 max-sm:text-sm max-sm:w-68'>{selectData.faculty}</h2>
                                            </div>
                                            <div className='mt-2'>
                                                <h2 className=' lg:text-xl max-sm:text-sm font-bold text-zinc-500'>Status</h2>
                                                <h2 className='lg:text-xl relative -top-1 text-zinc-400 max-sm:text-sm max-sm:w-68'>{selectData.status}</h2>
                                            </div>

                                        </div>
                                    </div>
                                    <div className='flex flex-wrap relative left-72 -top-5'>
                                        <button className='m-2 px-6 py-3 border rounded-2xl text-green-600 hover:bg-green-600 hover:text-white  border-green-600 ' onClick={() => handleApprove(ID)}>Accept</button>
                                        <button className='m-2 px-6 py-3 border rounded-2xl text-red-600 hover:bg-red-600 hover:text-white  border-red-600 ' onClick={() => handleReject(ID)}>Reject</button>

                                    </div>
                                </div>

                            </div>
                        </div>




                    </div>

                </div>


            </Dialog >

        </>
    );
}
